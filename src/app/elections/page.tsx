'use client';
import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  Search, Filter, ExternalLink, CalendarDays, MapPin, Building2, Vote, ChevronDown,
  ChevronUp, Globe, AlertTriangle, Clock, CheckCircle2, Radio, Landmark, Users, X
} from 'lucide-react';
import {
  getUpcomingElections, searchElections, filterByRegion, filterByStatus, filterByType,
  getNextElection, eciLinks, stateData, regionLabels, statusLabels, statusColors,
  type ElectionEvent, type Region, type ElectionStatus, type ElectionType
} from '@/lib/elections-data';
import { TrustLabel } from '@/components/trust-label';
import { useAppStore } from '@/lib/store';
import { format } from 'date-fns';

const typeLabels: Record<ElectionType | 'all', string> = {
  all: 'All Types',
  general: 'Lok Sabha',
  state_assembly: 'State Assembly',
  ut_assembly: 'UT Assembly',
  'by-election': 'By-Election',
};

const statusIcons: Record<ElectionStatus, typeof Clock> = {
  ongoing: Radio,
  announced: CalendarDays,
  upcoming: Clock,
  expected: CalendarDays,
  completed: CheckCircle2,
};

export default function ElectionsPage() {
  const { completeStep, addXP, earnBadge } = useAppStore();
  const [query, setQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState<Region | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<ElectionStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<ElectionType | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const allElections = useMemo(() => getUpcomingElections(), []);

  const filteredElections = useMemo(() => {
    let result = allElections;
    result = searchElections(result, query);
    result = filterByRegion(result, regionFilter);
    result = filterByStatus(result, statusFilter);
    result = filterByType(result, typeFilter);
    return result;
  }, [allElections, query, regionFilter, statusFilter, typeFilter]);

  const nextElection = useMemo(() => getNextElection(allElections), [allElections]);

  const activeFilters = [regionFilter !== 'all', statusFilter !== 'all', typeFilter !== 'all'].filter(Boolean).length;

  const clearFilters = () => {
    setRegionFilter('all');
    setStatusFilter('all');
    setTypeFilter('all');
    setQuery('');
  };

  // Stats
  const stats = useMemo(() => ({
    total: allElections.length,
    upcoming: allElections.filter(e => e.status === 'upcoming' || e.status === 'announced').length,
    totalSeats: allElections.filter(e => e.status !== 'completed').reduce((sum, e) => sum + e.seats, 0),
  }), [allElections]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-5 animate-fadeIn">
      {/* Header */}
      <div className="text-center">
        <h1 className="font-heading text-2xl font-bold flex items-center justify-center gap-2">
          <Landmark className="w-6 h-6 text-wattle" /> Upcoming Elections
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Real-time election tracker across India — State & Central</p>
        <div className="flex items-center justify-center gap-2 mt-2">
          <TrustLabel level="ECI_SOURCE" />
          <a href={eciLinks.main} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-500 flex items-center gap-0.5 hover:underline">
            Verify at eci.gov.in <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass-card p-3 text-center">
          <Landmark className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
          <p className="font-heading font-bold text-lg">{stats.total}</p>
          <p className="text-[10px] text-muted-foreground">Elections Tracked</p>
        </div>
        <div className="glass-card p-3 text-center">
          <Clock className="w-5 h-5 mx-auto mb-1 text-amber-500" />
          <p className="font-heading font-bold text-lg">{stats.upcoming}</p>
          <p className="text-[10px] text-muted-foreground">Coming Soon</p>
        </div>
        <div className="glass-card p-3 text-center">
          <Users className="w-5 h-5 mx-auto mb-1 text-blue-500" />
          <p className="font-heading font-bold text-lg">{stats.totalSeats.toLocaleString()}</p>
          <p className="text-[10px] text-muted-foreground">Total Seats</p>
        </div>
      </div>

      {/* Next Election Highlight */}
      {nextElection && (
        <div className="glass-card p-5 border-2 border-amber-500/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-wattle" />
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase text-amber-500">⚡ Next Election</span>
            <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${statusColors[nextElection.status]}`}>
              {statusLabels[nextElection.status]}
            </span>
          </div>
          <h3 className="font-heading font-bold text-lg">{nextElection.name}</h3>
          <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5" /> Est. {nextElection.estimatedPeriod}</span>
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {nextElection.state}</span>
            <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> {nextElection.seats} seats</span>
          </div>
          <a href={nextElection.ceoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-3 text-xs text-blue-500 hover:underline">
            Visit CEO Website <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}

      {/* Search + Filter Bar */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search states, elections, regions..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-bottle"
            />
            {query && (
              <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
              activeFilters > 0 ? 'border-bottle bg-bottle/10 text-wattle' : 'border-border bg-card'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
            {activeFilters > 0 && (
              <span className="w-5 h-5 rounded-full bg-bottle text-wattle text-[10px] flex items-center justify-center font-bold">{activeFilters}</span>
            )}
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="glass-card p-4 space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground uppercase">Filters</span>
              {activeFilters > 0 && (
                <button onClick={clearFilters} className="text-xs text-blue-500 hover:underline">Clear All</button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] text-muted-foreground font-medium block mb-1">Region</label>
                <select value={regionFilter} onChange={(e) => setRegionFilter(e.target.value as Region | 'all')}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-card text-xs">
                  {Object.entries(regionLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground font-medium block mb-1">Status</label>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as ElectionStatus | 'all')}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-card text-xs">
                  {Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground font-medium block mb-1">Type</label>
                <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as ElectionType | 'all')}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-card text-xs">
                  {Object.entries(typeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Showing <span className="font-bold text-foreground">{filteredElections.length}</span> of {allElections.length} elections
        </p>
        {query && <p className="text-xs text-muted-foreground">Results for &quot;{query}&quot;</p>}
      </div>

      {/* Election Cards */}
      <div className="space-y-3">
        {filteredElections.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <Search className="w-10 h-10 mx-auto mb-3 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">No elections found matching your criteria.</p>
            <button onClick={clearFilters} className="mt-3 text-xs text-blue-500 hover:underline">Clear filters</button>
          </div>
        ) : (
          filteredElections.map((election) => {
            const isExpanded = expandedId === election.id;
            const StatusIcon = statusIcons[election.status];
            const stateInfo = stateData.find(s => s.code === election.stateCode);

            return (
              <div key={election.id} className="glass-card overflow-hidden transition-all hover:shadow-lg">
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        election.type === 'general' ? 'bg-gradient-to-br from-amber-500 to-orange-600' :
                        election.status === 'announced' ? 'bg-gradient-to-br from-amber-500 to-amber-700' :
                        election.status === 'upcoming' ? 'bg-gradient-to-br from-blue-500 to-indigo-700' :
                        election.status === 'completed' ? 'bg-gradient-to-br from-green-500 to-green-700' :
                        'bg-gradient-to-br from-gray-400 to-gray-600'
                      }`}>
                        {election.type === 'general' ? <Vote className="w-5 h-5 text-white" /> : <Landmark className="w-5 h-5 text-white" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-heading font-bold text-sm truncate">{election.name}</h3>
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 ${statusColors[election.status]}`}>
                            <StatusIcon className="w-2.5 h-2.5" />
                            {statusLabels[election.status]}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" /> {election.scheduledDate || `Est. ${election.estimatedPeriod}`}</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {election.state}</span>
                          <span className="flex items-center gap-1"><Building2 className="w-3 h-3" /> {election.seats} seats</span>
                          <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> {regionLabels[election.region]}</span>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => setExpandedId(isExpanded ? null : election.id)}
                      className="p-1.5 rounded-lg hover:bg-muted transition-colors flex-shrink-0">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-border pt-3 space-y-3 animate-fadeIn">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div>
                        <span className="text-muted-foreground block mb-0.5">Election Type</span>
                        <span className="font-medium">{typeLabels[election.type]}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block mb-0.5">Total Seats</span>
                        <span className="font-medium">{election.seats}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block mb-0.5">Expected Period</span>
                        <span className="font-medium">{election.estimatedPeriod}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block mb-0.5">Region</span>
                        <span className="font-medium">{regionLabels[election.region]}</span>
                      </div>
                    </div>

                    {stateInfo && (
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-muted-foreground block mb-0.5">Last Election</span>
                          <span className="font-medium">{format(new Date(stateInfo.lastElectionDate), 'dd-MM-yyyy')}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block mb-0.5">Current Term Expires</span>
                          <span className="font-medium">{format(new Date(stateInfo.termExpiryDate), 'dd-MM-yyyy')}</span>
                        </div>
                      </div>
                    )}

                    {election.highlights && (
                      <div className="p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/20">
                        <p className="text-[10px] font-bold text-amber-500 mb-1">Highlights</p>
                        {election.highlights.map((h, i) => (
                          <p key={i} className="text-[11px] text-muted-foreground">• {h}</p>
                        ))}
                      </div>
                    )}

                    {/* Action Links */}
                    <div className="flex flex-wrap gap-2">
                      <a href={election.ceoUrl} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bottle text-wattle text-[11px] font-bold hover:bg-bottle-dark transition-colors">
                        <Globe className="w-3 h-3" /> CEO Website
                      </a>
                      <a href={eciLinks.voterServices} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-[11px] font-medium hover:bg-muted transition-colors">
                        <Vote className="w-3 h-3" /> Register to Vote
                      </a>
                      <a href={eciLinks.electoralSearch} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-[11px] font-medium hover:bg-muted transition-colors">
                        <Search className="w-3 h-3" /> Electoral Search
                      </a>
                      <a href={eciLinks.main} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-[11px] font-medium hover:bg-muted transition-colors">
                        <ExternalLink className="w-3 h-3" /> ECI Official
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer Disclaimer + Links */}
      <div className="glass-card p-5 space-y-3">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold mb-1">Data Disclaimer</p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Election dates are estimated based on the 5-year constitutional term of each assembly. Exact dates are announced by the Election Commission of India (ECI) typically 1-2 months before the election. Always verify with the official ECI website for confirmed schedules.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          {[
            { label: 'ECI Official', url: eciLinks.main },
            { label: 'Voter Portal', url: eciLinks.voterServices },
            { label: 'Election Results', url: eciLinks.eciResults },
            { label: 'cVIGIL App', url: eciLinks.cVigil },
            { label: 'PIB Updates', url: eciLinks.pib },
          ].map(link => (
            <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-muted text-[11px] font-medium hover:bg-bottle hover:text-wattle transition-colors">
              <ExternalLink className="w-3 h-3" /> {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
