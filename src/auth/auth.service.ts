import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UserEntity } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { HttpService } from '@nestjs/axios';
import { Octokit } from '@octokit/rest';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly httpService: HttpService,
  ) {}

  createToken(user: Partial<UserEntity>) {
    return this.jwtService.sign(user);
  }

  login(user: Partial<UserEntity>) {
    const token = this.createToken({
      id: user.id,
      username: user.username,
      role: user.role,
    });

    return { token };
  }

  async getUser(user) {
    return await this.userService.findOne(user.id);
  }

  async uploadImgToSMMS(file: Express.Multer.File): Promise<{
    success: boolean;
    message: string;
    data: any;
  }> {
    const fileBlob = new Blob([file.buffer], {
      type: 'application/octet-stream',
    });
    const formData = new FormData();
    formData.append('smfile', fileBlob, file.originalname);
    return await new Promise((resolve) => {
      this.httpService
        .post('https://sm.ms/api/v2/upload', formData, {
          headers: {
            Authorization: process.env.SMMS_TOKEN,
            'Content-Type': 'multipart/form-data',
          },
        })
        .subscribe((res) => {
          resolve(res.data);
        });
    });
  }

  async uploadImgToGithub(file: Express.Multer.File) {
    const fileBase64 = Buffer.from(file.buffer).toString('base64');
    const octokit = new Octokit({
      baseUrl: 'https://api.github.com',
      auth: `token ${process.env.GITHUB_TOKEN}`,
    });
    try {
      const githubRes = await octokit.request(
        `/repos/chenchunyang123/images/contents/${file.originalname}`,
        {
          method: 'PUT',
          message: '通过github api上传',
          content: fileBase64,
          branch: 'main',
        },
      );
      if (githubRes?.status === 201) {
        return {
          success: true,
          url: `https://raw.githubusercontent.com/chenchunyang123/images/main/${file.originalname}`,
        };
      } else {
        // 失败
        return {
          success: false,
          message: '状态码不为201',
        };
      }
    } catch (e) {
      return {
        success: false,
        message: e.message,
      };
    }
  }

  async uploadImg(file: Express.Multer.File) {
    const res = await this.uploadImgToSMMS(file);

    if (res?.success) {
      // 传到github备份
      const githubRes = await this.uploadImgToGithub(file);
      if (githubRes.success) {
        return {
          smmsUrl: res.data?.url,
          githubUrl: githubRes.url,
        };
      } else {
        await this.httpService.get(res.data?.delete);
        throw new InternalServerErrorException(
          `上传到github图床失败: ${githubRes?.message}`,
        );
      }
    } else {
      throw new InternalServerErrorException(
        `上传到smms图床失败: ${res?.message}`,
      );
    }
  }
}
