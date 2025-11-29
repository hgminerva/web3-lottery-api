import { ApiProperty } from "@nestjs/swagger";

export class GetBetsDto {
  @ApiProperty()
  draw_number: number;
}