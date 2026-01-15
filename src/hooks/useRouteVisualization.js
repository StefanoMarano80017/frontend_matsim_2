import { useMemo } from 'react';

export const useRoutePolyline = (routes) => {
  const polylines = useMemo(() => {
    if (!routes || routes.length === 0) return [];

    return routes.map((route) => ({
      id: `route-${route.id}`,
      positions: route.positions || [],
      color: '#2196f3',
      weight: 3,
    }));
  }, [routes]);

  return polylines;
};

export const useChargingStopsMarkers = (selectedRoute) => {
  const markers = useMemo(() => {
    if (!selectedRoute || !selectedRoute.chargingStops) return [];

    return selectedRoute.chargingStops.map((stop, index) => ({
      id: `stop-${index}`,
      pos: stop.position,
      type: 'charging-stop',
      name: stop.hubName,
      data: stop,
    }));
  }, [selectedRoute]);

  return markers;
};

export default { useRoutePolyline, useChargingStopsMarkers };
