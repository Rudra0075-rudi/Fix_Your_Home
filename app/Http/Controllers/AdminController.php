<?php

namespace App\Http\Controllers;

use App\Models\AuthAccount;
use App\Models\Worker;
use App\Models\Customer;
use App\Models\Service;
use App\Models\JobRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function getStats(Request $request)
    {
        // Ensure user is admin
        if ($request->user()->type !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        // Get total counts
        $totalUsers = Customer::count();
        $totalWorkers = Worker::count();
        $totalServices = Service::distinct('service')->count('service');
        
        // Get active workers (workers with at least one service)
        $activeWorkers = Worker::whereHas('services')->count();
        
        // Get pending approvals (workers without services - can be used for approval logic)
        $pendingApprovals = Worker::whereDoesntHave('services')->count();

        // Job and income metrics from job_requests
        $totalRequests = JobRequest::count();
        $totalOrders = JobRequest::whereIn('status', ['accepted', 'in_progress', 'completed'])->count();
        $totalIncome = JobRequest::where('status', 'completed')
            ->whereNotNull('final_price')
            ->sum('final_price');

        // Recent activities (placeholder - would come from activity log)
        $recentActivities = [
            [
                'title' => 'New worker registered',
                'detail' => 'A new worker joined the platform',
                'time' => '2 hours ago',
            ],
            [
                'title' => 'New user registered',
                'detail' => 'A new user signed up',
                'time' => '5 hours ago',
            ],
        ];

        // Financial snapshot based on completed jobs
        $financial = [
            'payouts' => $totalIncome,
            'platform_fees' => 0,
            'disputed' => 0,
        ];

        return response()->json([
            'kpis' => [
                'total_requests' => $totalRequests,
                'total_orders' => $totalOrders,
                'total_income' => $totalIncome,
                'active_workers' => $activeWorkers,
                'pending_approvals' => $pendingApprovals,
                'total_users' => $totalUsers,
                'total_workers' => $totalWorkers,
                'total_services' => $totalServices,
            ],
            'recent_activities' => $recentActivities,
            'financial' => $financial,
        ]);
    }
}

