import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SWAGGER_TOKEN_NAME } from '@/swagger/config';

@ApiTags('Dashboard')
@ApiBearerAuth(SWAGGER_TOKEN_NAME)
@Controller({
    path: 'admin/dashboard',
    version: '1',
})
export class DashboardController {
    constructor(
        private dashboardService: DashboardService,
    ){}

    @Get('summary-counts')
    public getSummaryCount(){
        return this.dashboardService.getSummaryCounts();
    }
}
