import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from '../order/schemas/order.schema';
import { AdminIssueController, IssueController } from './controller';
import { IssueService } from './issue.service';
import { Issue, IssueSchema } from './schemas/issue.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Issue.name, schema: IssueSchema },
      { name: Order.name, schema: OrderSchema },
    ]),
  ],
  controllers: [IssueController, AdminIssueController],
  providers: [IssueService],
  exports: [IssueService],
})
export class IssueModule {}
