import React, { useState, useEffect } from 'react';
import {
  fetchBusArrival,
  fetchCarparkAvailability,
  fetchTrafficIncidents,
  fetchTrainServiceAlerts,
  BusServiceArrival,
  CarparkItem,
  TrafficIncidentItem,
  TrainServiceAlertResponse,
} from '../services/transportApi';

interface LiveTransportCardProps {
  schoolName: string;
  defaultBusStop?: string;
}

export const LiveTransportCard: React.FC<LiveTransportCardProps> = ({
  schoolName,
  defaultBusStop = '83139',
}) => {
  const [activeTab, setActiveTab] = useState<'bus' | 'carpark' | 'train' | 'traffic'>('bus');
  const [busStopCode, setBusStopCode] = useState(defaultBusStop);
  const [serviceNo, setServiceNo] = useState('');
  
  // Bus state
  const [busServices, setBusServices] = useState<BusServiceArrival[]>([]);
  const [busLoading, setBusLoading] = useState(false);
  const [busError, setBusError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  // Carpark state
  const [carparks, setCarparks] = useState<CarparkItem[]>([]);
  const [carparkLoading, setCarparkLoading] = useState(false);
  const [carparkError, setCarparkError] = useState<string | null>(null);
  const [carparkSearch, setCarparkSearch] = useState('');

  // Train state
  const [trainStatus, setTrainStatus] = useState<TrainServiceAlertResponse | null>(null);
  const [trainLoading, setTrainLoading] = useState(false);
  const [trainError, setTrainError] = useState<string | null>(null);

  // Traffic state
  const [trafficIncidents, setTrafficIncidents] = useState<TrafficIncidentItem[]>([]);
  const [trafficLoading, setTrafficLoading] = useState(false);
  const [trafficError, setTrafficError] = useState<string | null>(null);

  // Fetch Bus Arrival
  const loadBusArrival = async () => {
    if (!busStopCode) return;
    setBusLoading(true);
    setBusError(null);
    const { data, error } = await fetchBusArrival(busStopCode, serviceNo || undefined);
    setBusLoading(false);
    if (error) {
      setBusError(error);
      setBusServices([]);
    } else if (data && data.Services) {
      setBusServices(data.Services);
      setLastRefreshed(new Date());
    } else {
      setBusServices([]);
    }
  };

  // Fetch Carparks
  const loadCarparks = async () => {
    setCarparkLoading(true);
    setCarparkError(null);
    const { data, error } = await fetchCarparkAvailability();
    setCarparkLoading(false);
    if (error) {
      setCarparkError(error);
      setCarparks([]);
    } else if (data && data.value) {
      setCarparks(data.value);
    }
  };

  // Fetch Train Alerts
  const loadTrainAlerts = async () => {
    setTrainLoading(true);
    setTrainError(null);
    const { data, error } = await fetchTrainServiceAlerts();
    setTrainLoading(false);
    if (error) {
      setTrainError(error);
      setTrainStatus(null);
    } else if (data) {
      setTrainStatus(data);
    }
  };

  // Fetch Traffic Incidents
  const loadTrafficIncidents = async () => {
    setTrafficLoading(true);
    setTrafficError(null);
    const { data, error } = await fetchTrafficIncidents();
    setTrafficLoading(false);
    if (error) {
      setTrafficError(error);
      setTrafficIncidents([]);
    } else if (data && data.value) {
      setTrafficIncidents(data.value);
    }
  };

  useEffect(() => {
    if (activeTab === 'bus') {
      loadBusArrival();
      const interval = setInterval(loadBusArrival, 20000); // 20-second live refresh
      return () => clearInterval(interval);
    } else if (activeTab === 'carpark') {
      loadCarparks();
    } else if (activeTab === 'train') {
      loadTrainAlerts();
    } else if (activeTab === 'traffic') {
      loadTrafficIncidents();
    }
  }, [activeTab, busStopCode, serviceNo]);

  // Helper to calculate minutes to arrival
  const getMinutesUntil = (isoDateStr?: string) => {
    if (!isoDateStr) return null;
    const arrivalTime = new Date(isoDateStr).getTime();
    const now = Date.now();
    const diffMins = Math.round((arrivalTime - now) / 60000);
    if (diffMins <= 0) return 'Arr';
    if (diffMins === 1) return '1 min';
    return `${diffMins} mins`;
  };

  const getLoadBadge = (load?: string) => {
    switch (load) {
      case 'SEA':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold px-1.5 py-0.5 rounded">Seats Avail</span>;
      case 'SDA':
        return <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-semibold px-1.5 py-0.5 rounded">Standing Avail</span>;
      case 'LSD':
        return <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-semibold px-1.5 py-0.5 rounded">Limited Standing</span>;
      default:
        return null;
    }
  };

  const renderError = (err: string) => {
    const isCredMissing = err.toLowerCase().includes('credential not configured');
    return (
      <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
        <div className="flex items-center gap-1.5 font-bold">
          <span className="material-symbols-outlined text-[16px] text-amber-600">
            {isCredMissing ? 'key' : 'error'}
          </span>
          <span>{isCredMissing ? 'LTA DataMall API Key Required' : 'Service Notice'}</span>
        </div>
        <p className="text-slate-700">
          {isCredMissing
            ? 'To view live Singapore LTA transport data (BusArrival v3, CarPark Availability, MRT Status & Traffic Incidents), set the LTA_DATAMALL_ACCOUNT_KEY in your server environment.'
            : err}
        </p>
      </div>
    );
  };

  return (
    <section className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-indigo-600 text-[20px]">
              directions_bus
            </span>
            <h2 className="font-bold text-sm md:text-base text-slate-900">
              Live School Commute & Transit (LTA DataMall)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time bus arrivals, live parking availability, MRT status, and traffic incidents for {schoolName}.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
          <button
            onClick={() => setActiveTab('bus')}
            className={`px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer ${
              activeTab === 'bus' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Bus Arrival (v3)
          </button>
          <button
            onClick={() => setActiveTab('carpark')}
            className={`px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer ${
              activeTab === 'carpark' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Live Carparks
          </button>
          <button
            onClick={() => setActiveTab('train')}
            className={`px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer ${
              activeTab === 'train' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            MRT/LRT Status
          </button>
          <button
            onClick={() => setActiveTab('traffic')}
            className={`px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer ${
              activeTab === 'traffic' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Traffic
          </button>
        </div>
      </div>

      {/* Tab 1: Next Bus Arrival (v3) */}
      {activeTab === 'bus' && (
        <div className="space-y-3">
          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <div className="flex items-center gap-2 text-xs">
              <label className="font-semibold text-slate-700">Bus Stop Code:</label>
              <input
                type="text"
                value={busStopCode}
                onChange={(e) => setBusStopCode(e.target.value)}
                placeholder="e.g. 83139"
                className="w-24 px-2 py-1 bg-white border border-slate-300 rounded text-slate-900 font-bold focus:outline-none focus:border-indigo-600"
              />
              <label className="font-semibold text-slate-700 ml-2">Service No:</label>
              <input
                type="text"
                value={serviceNo}
                onChange={(e) => setServiceNo(e.target.value)}
                placeholder="All or 15"
                className="w-20 px-2 py-1 bg-white border border-slate-300 rounded text-slate-900 font-bold focus:outline-none focus:border-indigo-600"
              />
            </div>
            <div className="flex items-center gap-2">
              {lastRefreshed && (
                <span className="text-[11px] text-slate-500">
                  Synced: {lastRefreshed.toLocaleTimeString()} (20s refresh)
                </span>
              )}
              <button
                onClick={loadBusArrival}
                disabled={busLoading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span className={`material-symbols-outlined text-[14px] ${busLoading ? 'animate-spin' : ''}`}>
                  refresh
                </span>
                <span>{busLoading ? 'Syncing...' : 'Refresh'}</span>
              </button>
            </div>
          </div>

          {busError && renderError(busError)}

          {!busError && busServices.length === 0 && !busLoading && (
            <div className="text-center py-6 text-xs text-slate-500 bg-slate-50 rounded-lg border border-slate-200">
              No bus services found for stop code {busStopCode}. Try checking the stop code.
            </div>
          )}

          {/* Bus Service Cards Grid */}
          {!busError && busServices.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {busServices.map((srv) => {
                const next1Min = getMinutesUntil(srv.NextBus?.EstimatedArrival);
                const next2Min = getMinutesUntil(srv.NextBus2?.EstimatedArrival);
                const next3Min = getMinutesUntil(srv.NextBus3?.EstimatedArrival);

                return (
                  <div
                    key={srv.ServiceNo}
                    className="bg-slate-50 hover:bg-slate-100/70 p-3 rounded-lg border border-slate-200 transition-colors flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-extrabold text-lg text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        {srv.ServiceNo}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500">
                        {srv.Operator}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between items-center bg-white p-1.5 rounded border border-slate-200">
                        <span className="font-bold text-slate-800">
                          {next1Min || 'No timing'}
                        </span>
                        {getLoadBadge(srv.NextBus?.Load)}
                      </div>

                      {(next2Min || next3Min) && (
                        <div className="flex justify-between items-center text-[11px] text-slate-500 px-1">
                          <span>Next: {next2Min || '-'}</span>
                          <span>Subseq: {next3Min || '-'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Live Carpark Lots */}
      {activeTab === 'carpark' && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <div className="flex items-center gap-2 text-xs w-full sm:w-auto">
              <span className="material-symbols-outlined text-slate-400 text-[18px]">search</span>
              <input
                type="text"
                value={carparkSearch}
                onChange={(e) => setCarparkSearch(e.target.value)}
                placeholder="Search carpark location or area..."
                className="w-full sm:w-64 px-2 py-1 bg-white border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
              />
            </div>
            <button
              onClick={loadCarparks}
              disabled={carparkLoading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span className={`material-symbols-outlined text-[14px] ${carparkLoading ? 'animate-spin' : ''}`}>
                refresh
              </span>
              <span>{carparkLoading ? 'Syncing...' : 'Refresh'}</span>
            </button>
          </div>

          {carparkError && renderError(carparkError)}

          {!carparkError && (
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                    <th className="py-2.5 px-3 font-semibold">Development / Carpark</th>
                    <th className="py-2.5 px-3 font-semibold">Agency</th>
                    <th className="py-2.5 px-3 font-semibold">Area</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Available Lots</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {carparks
                    .filter((c) =>
                      carparkSearch
                        ? c.Development?.toLowerCase().includes(carparkSearch.toLowerCase()) ||
                          c.Area?.toLowerCase().includes(carparkSearch.toLowerCase()) ||
                          c.CarParkID?.toLowerCase().includes(carparkSearch.toLowerCase())
                        : true
                    )
                    .slice(0, 8)
                    .map((c) => (
                      <tr key={c.CarParkID + c.LotType} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2 px-3 font-medium text-slate-900">
                          {c.Development || c.CarParkID}
                          <span className="text-[10px] text-slate-400 block font-normal">ID: {c.CarParkID}</span>
                        </td>
                        <td className="py-2 px-3">
                          <span className="bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold px-1.5 py-0.5 rounded">
                            {c.Agency}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-slate-600">{c.Area || 'Singapore'}</td>
                        <td className="py-2 px-3 text-right font-bold">
                          <span className={c.AvailableLots > 20 ? 'text-emerald-600' : 'text-rose-600'}>
                            {c.AvailableLots} lots
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: MRT/LRT Status */}
      {activeTab === 'train' && (
        <div className="space-y-3">
          {trainError && renderError(trainError)}

          {!trainError && (
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      trainStatus?.Status === 1 || !trainStatus?.Status ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'
                    }`}
                  ></div>
                  <span className="font-bold text-xs md:text-sm text-slate-900">
                    {trainStatus?.Status === 1 || !trainStatus?.Status
                      ? 'All MRT & LRT Lines Operating Normally'
                      : 'Train Service Disruption Reported'}
                  </span>
                </div>
                <button
                  onClick={loadTrainAlerts}
                  disabled={trainLoading}
                  className="text-indigo-600 hover:text-indigo-800 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <span className={`material-symbols-outlined text-[14px] ${trainLoading ? 'animate-spin' : ''}`}>
                    refresh
                  </span>
                  <span>Check Live</span>
                </button>
              </div>

              {trainStatus?.Message && trainStatus.Message.length > 0 ? (
                <div className="space-y-2 mt-2">
                  {trainStatus.Message.map((msg, i) => (
                    <div key={i} className="p-3 bg-white rounded border border-rose-200 text-xs text-rose-900">
                      <p className="font-bold">{msg.Line || 'Affected Line'}: {msg.Stations}</p>
                      <p className="text-slate-600 mt-1">{msg.Message}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-600">
                  Real-time status feed from LTA DataMall TrainServiceAlerts. No line disruptions currently flagged on the network.
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Traffic Incidents */}
      {activeTab === 'traffic' && (
        <div className="space-y-3">
          {trafficError && renderError(trafficError)}

          {!trafficError && (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs text-slate-600 pb-1">
                <span>Active road & expressway advisories across Singapore:</span>
                <button
                  onClick={loadTrafficIncidents}
                  disabled={trafficLoading}
                  className="text-indigo-600 hover:text-indigo-800 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <span className={`material-symbols-outlined text-[14px] ${trafficLoading ? 'animate-spin' : ''}`}>
                    refresh
                  </span>
                  <span>Refresh</span>
                </button>
              </div>

              {trafficIncidents.length === 0 ? (
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 text-center">
                  No major traffic incidents or expressway bottlenecks currently reported by LTA.
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {trafficIncidents.slice(0, 10).map((inc, i) => (
                    <div key={i} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                        <span className="material-symbols-outlined text-amber-600 text-[16px]">warning</span>
                        <span>{inc.Type}</span>
                      </div>
                      <p className="text-slate-600">{inc.Message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
};
