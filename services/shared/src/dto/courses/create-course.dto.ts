import { IsString, IsArray, IsOptional, MinLength } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  @MinLength(10)
  description: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}