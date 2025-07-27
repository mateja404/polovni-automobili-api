import { registerAs } from '@nestjs/config';
import { JwtSignOptions } from '@nestjs/jwt';

export default registerAs("refresh-jwt", (): JwtSignOptions => ({
  secret: 'BWyJ9stWfyH0y2g8fKeuIipYKpTsapvkToDYTiIAVv4=',
  expiresIn: '7d'
}));