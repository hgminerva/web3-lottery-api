import { ApiProperty } from "@nestjs/swagger";

export class AddBetDto {
  @ApiProperty()
  draw_number: number;

  @ApiProperty()
  bet_number: number;

  @ApiProperty()
  bettor: string;

  @ApiProperty()
  upline: string;

  @ApiProperty()
  tx_hash: string;
}
