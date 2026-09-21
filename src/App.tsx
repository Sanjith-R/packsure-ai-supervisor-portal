import React, { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardView } from './components/dashboard/DashboardView';
import { InspectionsView } from './components/inspections/InspectionsView';
import { InspectionDetailView } from './components/inspections/InspectionDetailView';
import { ReinspectionModal } from './components/inspections/ReinspectionModal';
import { ReinspectionsView } from './components/reinspections/ReinspectionsView';
import { ReportsView } from './components/reports/ReportsView';
import { OfficersView } from './components/officers/OfficersView';
import { SettingsView } from './components/settings/SettingsView';

import { 
  SidebarMenuItem, 
  Inspection, 
  SupervisorDecision, 
  ReinspectionRecord,
  AuditTimelineEvent,
  DispatchAssignment
} from './types/inspection';
import { INITIAL_INSPECTIONS, REINSPECTION_RECORDS_MOCK } from './data/mockData';

export default function App() {
  const [currentView, setCurrentView] = useState<SidebarMenuItem>('Dashboard');
  const [inspections, setInspections] = useState<Inspection[]>(INITIAL_INSPECTIONS);
  const [reinspectionRecords, setReinspectionRecords] = useState<ReinspectionRecord[]>(REINSPECTION_RECORDS_MOCK);
  const [selectedInspection, setSelectedInspection] = useState<Inspection | null>(null);
  const [isReinspectionModalOpen, setIsReinspectionModalOpen] = useState<boolean>(false);
  const [reinspectionTargetInspection, setReinspectionTargetInspection] = useState<Inspection | null>(null);

  // Filter pending reviews count for sidebar badge
  const pendingCount = inspections.filter(i => i.supervisorDecision === 'Pending Review').length;

  // Handle switching views
  const handleSelectView = (item: SidebarMenuItem) => {
    setSelectedInspection(null);
    setCurrentView(item);
  };

  // Handle selecting an inspection to open detail view
  const handleSelectInspection = (inspection: Inspection) => {
    setSelectedInspection(inspection);
  };

  // Handle back to listing from detail view
  const handleBackToInspections = () => {
    setSelectedInspection(null);
  };

  // Handle supervisor decision submission
  const handleUpdateDecision = (
    inspectionId: string,
    decision: SupervisorDecision,
    comment: string
  ) => {
    const timestamp = new Date().toLocaleString();
    const newTimelineEvent: AuditTimelineEvent = {
      id: `aud-${Date.now()}`,
      title: decision === 'Order Reinspection' ? 'Reinspection Ordered' : 'Supervisor Review',
      timestamp,
      actor: 'Amit K. Deshmukh (LM-SUP-MH-014)',
      role: 'Legal Metrology Supervisor',
      description: `Formal determination recorded: "${decision}". Note: ${comment}`,
      digitalHash: `SHA-256: 9b${Math.random().toString(16).slice(2, 8)}...8a`,
      status: 'completed'
    };

    setInspections(prev =>
      prev.map(item => {
        if (item.id === inspectionId) {
          const updatedTimeline = [...item.auditTimeline, newTimelineEvent];
          // If decision is confirmed compliant or confirmed non-compliant, mark final decision as completed
          if (decision === 'Confirmed Compliant' || decision === 'Confirmed Non-Compliant') {
            updatedTimeline.push({
              id: `aud-final-${Date.now()}`,
              title: 'Final Decision',
              timestamp,
              actor: 'Central LM Regulatory Cloud',
              role: 'Statutory Registry',
              description: `Inspection file closed and sealed with determination: ${decision}. Form-V generated.`,
              digitalHash: `SHA-256: 4e${Math.random().toString(16).slice(2, 8)}...f2`,
              status: 'completed'
            });
          }

          const updated: Inspection = {
            ...item,
            supervisorDecision: decision,
            supervisorComment: comment,
            supervisorReviewDate: timestamp,
            auditTimeline: updatedTimeline
          };

          // Also update currently viewed inspection
          if (selectedInspection && selectedInspection.id === inspectionId) {
            setSelectedInspection(updated);
          }
          return updated;
        }
        return item;
      })
    );
  };

  // Handle opening reinspection modal for current or any inspection
  const handleOpenReinspectionModal = (target?: Inspection) => {
    const toInspect = target || selectedInspection || inspections[0];
    setReinspectionTargetInspection(toInspect);
    setIsReinspectionModalOpen(true);
  };

  // Handle creating linked reinspection
  const handleCreateReinspection = (
    childInspection: Inspection,
    reinspectionRecord: ReinspectionRecord
  ) => {
    // 1. Add child inspection to list
    // 2. Update parent inspection's reinspectionHistory and decision
    setInspections(prev => {
      const updatedParent = prev.map(item => {
        if (item.id === reinspectionRecord.originalInspectionId) {
          return {
            ...item,
            supervisorDecision: 'Order Reinspection' as SupervisorDecision,
            reinspectionHistory: {
              isReinspection: false,
              childInspectionId: childInspection.id,
              originalBatch: item.batchNumber,
              newBatch: childInspection.batchNumber,
              orderReason: reinspectionRecord.reason
            }
          };
        }
        return item;
      });

      return [childInspection, ...updatedParent];
    });

    // 3. Add to reinspection records
    setReinspectionRecords(prev => [reinspectionRecord, ...prev]);

    // Close modal
    setIsReinspectionModalOpen(false);

    // Open the new child inspection
    setSelectedInspection(childInspection);
  };

  // Switch to related inspection (e.g. parent or child in reinspection chain)
  const handleSelectRelatedInspection = (id: string) => {
    const target = inspections.find(i => i.id === id);
    if (target) {
      setSelectedInspection(target);
    }
  };

  // Handle universal search from header
  const handleUniversalSearch = (query: string) => {
    if (!query) return;
    const found = inspections.find(
      i =>
        i.id.toLowerCase().includes(query.toLowerCase()) ||
        i.productName.toLowerCase().includes(query.toLowerCase()) ||
        i.batchNumber.toLowerCase().includes(query.toLowerCase())
    );
    if (found) {
      setSelectedInspection(found);
    } else {
      setSelectedInspection(null);
      setCurrentView('Inspections');
    }
  };

  // Handle field officer assignment dispatch
  const handleAssignDispatch = (dispatchData: DispatchAssignment) => {
    if (dispatchData.inspectionId) {
      setInspections(prev => prev.map(insp => {
        if (insp.id === dispatchData.inspectionId) {
          const newEvent: AuditTimelineEvent = {
            id: `EVT-${Date.now()}`,
            title: 'Field Officer Dispatched',
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
            actor: 'Chief Legal Metrology Supervisor',
            role: 'District Authority',
            description: `Statutory dispatch order #${dispatchData.id} (${dispatchData.targetType}) assigned to Officer ${dispatchData.officerName} (${dispatchData.officerBadge}). Directives: ${dispatchData.instructions}`,
            status: 'in-progress'
          };
          return {
            ...insp,
            officerName: dispatchData.officerName,
            officerBadge: dispatchData.officerBadge,
            officerZone: dispatchData.zone || insp.officerZone,
            auditTimeline: [...insp.auditTimeline, newEvent]
          };
        }
        return insp;
      }));
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 font-sans antialiased text-slate-800 selection:bg-[#f59042] selection:text-white">
      {/* Fixed Navigation Sidebar matching mobile theme */}
      <Sidebar
        currentMenu={selectedInspection ? 'Inspections' : currentView}
        activeItem={selectedInspection ? 'Inspections' : currentView}
        onSelectMenu={handleSelectView}
        onSelectItem={handleSelectView}
        pendingCount={pendingCount}
        reinspectionCount={reinspectionRecords.length}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <Header
          currentViewTitle={selectedInspection ? 'Inspection Review' : currentView}
          onNavigateHome={() => {
            setSelectedInspection(null);
            setCurrentView('Dashboard');
          }}
          pendingCount={pendingCount}
          onNavigateToPending={() => {
            setSelectedInspection(null);
            setCurrentView('Inspections');
          }}
          onSelectInspection={handleSelectInspection}
          inspections={inspections}
          onSearch={handleUniversalSearch}
        />

        {/* Scrollable Stage */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-slate-100">
          <div className="max-w-7xl mx-auto">
            {/* Show Inspection Detail Page if an inspection is selected */}
            {selectedInspection ? (
              <InspectionDetailView
                inspection={selectedInspection}
                onBack={handleBackToInspections}
                onNavigateHome={() => {
                  setSelectedInspection(null);
                  setCurrentView('Dashboard');
                }}
                onUpdateDecision={handleUpdateDecision}
                onOpenReinspectionModal={() => handleOpenReinspectionModal(selectedInspection)}
                onSelectRelatedInspection={handleSelectRelatedInspection}
              />
            ) : (
              <>
                {/* View Switcher */}
                {currentView === 'Dashboard' && (
                  <DashboardView
                    inspections={inspections}
                    onSelectInspection={handleSelectInspection}
                    onNavigateToView={handleSelectView}
                  />
                )}

                {currentView === 'Inspections' && (
                  <InspectionsView
                    inspections={inspections}
                    onSelectInspection={handleSelectInspection}
                  />
                )}

                {currentView === 'Reinspections' && (
                  <ReinspectionsView
                    inspections={inspections}
                    reinspectionRecords={reinspectionRecords}
                    onSelectInspection={handleSelectInspection}
                    onOpenReinspectionModalForAny={() => handleOpenReinspectionModal()}
                  />
                )}

                {currentView === 'Reports' && (
                  <ReportsView
                    inspections={inspections}
                    onSelectInspection={handleSelectInspection}
                  />
                )}

                {currentView === 'Officers' && (
                  <OfficersView
                    inspections={inspections}
                    onAssignDispatch={handleAssignDispatch}
                    onSelectInspection={handleSelectInspection}
                  />
                )}

                {currentView === 'Settings' && <SettingsView />}
              </>
            )}
          </div>
        </main>
      </div>

      {/* Linked Reinspection Modal */}
      {isReinspectionModalOpen && reinspectionTargetInspection && (
        <ReinspectionModal
          inspection={reinspectionTargetInspection}
          onClose={() => setIsReinspectionModalOpen(false)}
          onSubmitReinspection={handleCreateReinspection}
        />
      )}
    </div>
  );
}
