import { Controller, Post, UploadedFile, UseGuards, UseInterceptors, Req, Delete, Get, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';


interface AuthenticatedRequest extends Request {
  user: any;
}

@UseGuards(AuthGuard('jwt'))
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req: AuthenticatedRequest) {
    const userId = req.user['sub']; 
    return this.uploadService.handleFile(file, userId);
  }

  @Delete(':id')
  async deleteFile(@Req() req: AuthenticatedRequest, @Param('id') fileId: string) {
    const userId = req.user['sub'];
    
    const doc = await this.uploadService.findOne(fileId);
    if (!doc || doc.userId !== userId) {
      throw new Error('Acesso negado');
    }

    return this.uploadService.delete(fileId);
  }

  @Get()
  async getFiles(@Req() req: AuthenticatedRequest) {
    const userId = req.user['sub']; 
    return this.uploadService.getFiles(userId);
  }
}
