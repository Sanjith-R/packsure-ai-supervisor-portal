import React from 'react';
import { 
  FileCheck2, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCw, 
  ArrowUpRight, 
  Users, 
  ShieldAlert, 
  ChevronRight,
  Scale
} from 'lucide-react';
import { Inspection, SidebarMenuItem } from '../../types/inspection';
import { VIOLATION_CATEGORIES_DATA, OFFICER_ACTIVITY_DATA } from '../../data/mockData';
import { ComplianceChart } from './ComplianceChart';

interface DashboardViewProps {
  inspections: Inspection[];
  onSelectInspection: (inspection: Inspection) => void;
  onNavigateToView: (view: SidebarMenuItem) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  inspections,
  onSelectInspection,
  onNavigateToView
}) => {
  // Compute KPI metrics dynamically from state
  const totalInspections = 1482; // System cumulative + current session
  const pendingReviews = inspections.filter(i => i.supervisorDecision === 'Pending Review').length;
  const compliantProducts = inspections.filter(i => i.aiComplianceResult === 'Compliant').length;
  const nonCompliantProducts = inspections.filter(i => i.aiComplianceResult === 'Non-Compliant').length;
  const reinspectionsCount = inspections.filter(i => i.supervisorDecision === 'Order Reinspection' || i.reinspectionHistory?.isReinspection).length;

  const cards = [
    {
      title: 'Total Inspections',
      value: totalInspections.toLocaleString(),
      subtext: '+12.4% vs last month',
      trend: 'up',
      icon: <FileCheck2 className="w-5 h-5 text-[#f59042]" />,
      accentBg: 'bg-amber-50 border-amber-200',
      actionView: 'Inspections' as SidebarMenuItem
    },
    {
      title: 'Pending Reviews',
      value: pendingReviews.toString(),
      subtext: '4 requiring urgent action',
      trend: 'urgent',
      icon: <Clock className="w-5 h-5 text-amber-600" />,
      accentBg: 'bg-amber-50 border-amber-200',
      actionView: 'Inspections' as SidebarMenuItem
    },
    {
      title: 'Compliant Products',
      value: '1,189',
      subtext: '80.2% overall pass rate',
      trend: 'up',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
      accentBg: 'bg-emerald-50 border-emerald-200',
      actionView: 'Inspections' as SidebarMenuItem
    },
    {
      title: 'Non-Compliant Products',
      value: '215',
      subtext: '14.5% non-conformity rate',
      trend: 'alert',
      icon: <AlertTriangle className="w-5 h-5 text-rose-600" />,
      accentBg: 'bg-rose-50 border-rose-200',
      actionView: 'Inspections' as SidebarMenuItem
    },
    {
      title: 'Reinspections',
      value: '78',
      subtext: '94.8% resolved upon re-audit',
      trend: 'neutral',
      icon: <RotateCw className="w-5 h-5 text-[#f59042]" />,
      accentBg: 'bg-amber-50 border-amber-200',
      actionView: 'Reinspections' as SidebarMenuItem
    }
  ];

  return (
    <div className="space-y-6 text-slate-800">
      {/* 5 Dashboard KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((card, i) => (
          <div
            key={i}
            onClick={() => onNavigateToView(card.actionView)}
            className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md hover:border-[#f5b342] cursor-pointer transition-all duration-200 group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 group-hover:text-[#f59042] transition-colors">
                {card.title}
              </span>
              <div className={`p-2 rounded-lg ${card.accentBg}`}>
                {card.icon}
              </div>
            </div>

            <div className="my-1">
              <div className="text-2xl font-extrabold text-slate-900 tracking-tight group-hover:text-[#dd742b] transition-colors">
                {card.value}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1 font-medium">
                {card.subtext}
              </div>
            </div>

            <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-semibold text-[#f59042]">
              <span>Inspect view</span>
              <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {/* Compliance Trends Chart */}
      <ComplianceChart />

      {/* Two-Column Grid: Top Violation Categories & Officer Activity Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Violation Categories */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  Statutory Non-Conformity Distribution
                </h3>
              </div>
            </div>
            <button
              onClick={() => onNavigateToView('Inspections')}
              className="text-xs font-semibold text-[#f59042] hover:text-[#dd742b] flex items-center gap-1"
            >
              <span>View Inspections</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {VIOLATION_CATEGORIES_DATA.slice(0, 5).map((v, index) => (
              <div key={index} className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1.5 hover:bg-slate-100/60 transition-colors">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#b8591e] bg-[#feeed8] px-2 py-0.5 rounded text-[11px]">
                      {v.ruleCode}
                    </span>
                    <span className="font-semibold text-slate-800 line-clamp-1">
                      {v.ruleName}
                    </span>
                  </div>
                  <span className="font-bold text-slate-900 shrink-0 ml-2">
                    {v.count} cases
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      v.severity === 'Critical' ? 'bg-rose-500' : 'bg-gradient-to-r from-[#f59042] to-[#f5b342]'
                    }`}
                    style={{ width: `${v.percentage * 2}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-mono text-[10px] text-slate-500">{v.penaltyClause}</span>
                  <span className="font-bold text-slate-700">{v.percentage}% of all violations</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Officer Activity Summary */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-50 text-[#f59042]">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  Field Officer Activity Summary
                </h3>
              </div>
            </div>
            <button
              onClick={() => onNavigateToView('Officers')}
              className="text-xs font-semibold text-[#f59042] hover:text-[#dd742b] flex items-center gap-1"
            >
              <span>View Roster</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {OFFICER_ACTIVITY_DATA.map((officer) => (
              <div key={officer.badge} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 border border-amber-200 text-[#b8591e] font-bold text-xs flex items-center justify-center">
                    {officer.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      {officer.name}
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Online Live" />
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {officer.badge} • {officer.zone.split('(')[0]}
                    </div>
                  </div>
                </div>

                <div className="text-right space-y-0.5">
                  <div className="font-bold text-slate-800">
                    {officer.totalInspected} audits
                  </div>
                  <div className="text-[11px] text-emerald-700 font-semibold">
                    {officer.complianceRate} compliant
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enforcement Velocity & Statutory Resolution Metrics */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Statutory Resolution & Enforcement Velocity
              </h3>
            </div>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
            All SLAs Compliant
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-xs text-slate-500 font-medium">Form-V Notice Dispatch SLA</div>
            <div className="text-xl font-extrabold text-slate-900 mt-1">100% &lt; 24h</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
              Zero dispatch backlogs
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-xs text-slate-500 font-medium">Show-Cause Compounding Velocity</div>
            <div className="text-xl font-extrabold text-slate-900 mt-1">8.4 Days</div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Within 15-day statutory limit
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-xs text-slate-500 font-medium">Re-audit Clearance Rate</div>
            <div className="text-xl font-extrabold text-slate-900 mt-1">94.8%</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
              74 of 78 lots cleared
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
