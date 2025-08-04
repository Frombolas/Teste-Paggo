import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
  [x: string]: any;
  constructor(private readonly prisma: PrismaService) {}

  async handleFile(file: Express.Multer.File, userId: string) {
    const uploadsDir = path.join(__dirname, '..', '..', 'uploads');

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, file.originalname);
    fs.writeFileSync(filePath, file.buffer);

   try {
        return {
            message: 'Upload registrado com sucesso',
            document: await this.prisma.document.create({
            data: {
                filename: file.originalname,
                mimetype: file.mimetype,
                path: filePath,
                userId,
            },
        }),
    };
    }catch (err) {
        console.error(err);
        throw new InternalServerErrorException('Erro ao salvar no banco de dados.');
    }
  }

  async delete(id:string){
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