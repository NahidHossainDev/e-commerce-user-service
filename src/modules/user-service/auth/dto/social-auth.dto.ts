import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GoogleLoginDto {
  @ApiProperty({ description: 'ID Token received from Google' })
  @IsString()
  @IsNotEmpty()
  googleIdToken: string;
}

export class FacebookLoginDto {
  @ApiProperty({ description: 'Access Token received from Facebook' })
  @IsString()
  @IsNotEmpty()
  facebookAccessToken: string;
}
