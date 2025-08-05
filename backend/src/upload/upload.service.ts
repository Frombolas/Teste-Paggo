import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import * as Tesseract from 'tesseract.js';
// @ts-ignore
import * as pdf from 'pdf-poppler';
import axios from 'axios';

@Injectable()
export class UploadService {
  [x: string]: any;
  constructor(private readonly prisma: PrismaService) {}

async handleFile(file: Express.Multer.File, userId: string) {
    const uploadsDir = path.join(__dirname, '..', '..', 'uploads');

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const savedFilePath = path.join(uploadsDir, file.originalname);
    fs.writeFileSync(savedFilePath, file.buffer);

    let ocrImagePath = savedFilePath;

    if (file.mimetype === 'application/pdf') {
      const outputDir = path.join(uploadsDir, 'pdf_images');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const opts = {
        format: 'png',
        out_dir: outputDir,
        out_prefix: path.parse(file.originalname).name,
        page: 1,
      };

      try {
        await pdf.convert(savedFilePath, opts);
        ocrImagePath = path.join(outputDir, `${opts.out_prefix}-1.png`);
      } catch (error) {
        console.error('Erro ao converter PDF para imagem:', error);
        throw new InternalServerErrorException('Erro ao processar arquivo PDF.');
      }
    } else if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('Apenas imagens e PDFs são suportados.');
    }

    const {
      data: { text: ocrText },
    } = await Tesseract.recognize(ocrImagePath, 'por+eng');

    // 🔁 Chamada para a API da Groq
    const groqResponse = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-70b-8192',
        messages: [
          { role: 'system', content: 'Você é um assistente que explica textos escaneados.' },
          { role: 'user', content: `Explique o seguinte texto extraído por OCR:\n\n${ocrText}` },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`, // ✅ variavel de ambiente
        },
      }
    );

    const explanation =
      groqResponse.data?.choices?.[0]?.message?.content ?? 'Erro ao gerar explicação';

    // Salvar no banco
    const document = await this.prisma.document.create({
      data: {
        filename: file.originalname,
        mimetype: file.mimetype,
        path: savedFilePath,
        userId,
        ocrText,
        iaResponse: explanation,
      },
    });

    return {
      message: 'Upload e análise concluídos com sucesso.',
      document,
    };
  }


  async delete(id: string) {
    const document = await this.prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      throw new Error('Documento não encontrado');
    }

    const filePath = document.path;

    try {
      fs.unlinkSync(filePath);
      await this.prisma.document.delete({
        where: { id },
      });
      return { message: 'Arquivo deletado com sucesso' };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Erro ao deletar o arquivo.');
    }
  }

  async getFiles(userId: string) {
    return this.prisma.document.findMany({
      where: { userId },
    });
  }

  async findOne(id: string) {
    return this.prisma.document.findUnique({
      where: { id },
    });
  }
}
