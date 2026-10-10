'use client';

import type { IcareHospital } from '@/data/hospitals-specialists-data';
import { GoogleMap, InfoWindow, Marker, useLoadScript } from '@react-google-maps/api';
import { AlertTriangle, ExternalLink, MapPin, Navigation, Phone, Star } from 'lucide-react';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import styles from './HospitalMap.module.css';

interface HospitalMapProps {
	hospitals: IcareHospital[];
	selectedHospital?: IcareHospital | null;
	onHospitalSelect?: (hospital: IcareHospital) => void;
	height?: string;
}

const containerStyle = {
	width: '100%',
	height: '100%',
};

function ApiKeyMissing({ height }: { height: string }) {
	return (
		<div className={styles.statusContainer} style={{ height }}>
			<AlertTriangle className={`${styles.statusIcon} ${styles.warning}`} />
			<h3 className={styles.statusTitle}>Google Maps API Key Required</h3>
			<p className={styles.statusMessage}>
				To display the interactive map, please add your Google Maps API key.
			</p>
			<div className={styles.stepsContainer}>
				<p className={styles.stepsTitle}>Steps to add your API key:</p>
				<ol className={styles.stepsList}>
					<li>
						Go to{' '}
						<a
							href="https://console.cloud.google.com/google/maps-apis"
							target="_blank"
							rel="noopener noreferrer"
							className={styles.link}
						>
							Google Cloud Console
						</a>
					</li>
					<li>Create or select a project</li>
					<li>Enable "Maps JavaScript API"</li>
					<li>Create an API key</li>
					<li>
						Add it in the <strong>Vars</strong> section of the sidebar as:
					</li>
				</ol>
				<code className={styles.codeBlock}>GOOGLE_MAPS_API_KEY=your_api_key_here</code>
			</div>
		</div>
	);
}

function HospitalMap({
	hospitals,
	selectedHospital,
	onHospitalSelect,
	height,
	apiKey,
}: HospitalMapProps & { apiKey?: string }) {
	const [map, setMap] = useState<google.maps.Map | null>(null);
	const [activeMarker, setActiveMarker] = useState<string | null>(null);
	const [hoveredMarker, setHoveredMarker] = useState<string | null>(null);

	const { isLoaded, loadError } = useLoadScript({
		id: 'google-map-script',
		googleMapsApiKey: apiKey || 'AIzaSyB2mSz9BQinYrg-r6WpXKs2xIjiBhnum6Y', // Use provided key or fallback
	});

	const mapCenter = useMemo(() => {
		if (hospitals.length === 0) {
			return { lat: 40.7128, lng: -74.006 };
		}
		const avgLat = hospitals.reduce((sum, h) => sum + h.coordinates.lat, 0) / hospitals.length;
		const avgLng = hospitals.reduce((sum, h) => sum + h.coordinates.lng, 0) / hospitals.length;
		return { lat: avgLat, lng: avgLng };
	}, [hospitals]);

	useEffect(() => {
		if (selectedHospital) {
			setActiveMarker(selectedHospital.id);
			if (map) {
				map.panTo(selectedHospital.coordinates);
				map.setZoom(15);
			}
		}
	}, [selectedHospital, map]);

	const onLoad = useCallback((map: google.maps.Map) => {
		setMap(map);
	}, []);

	const onUnmount = useCallback(() => {
		setMap(null);
	}, []);

	const handleMarkerClick = useCallback(
		(hospital: IcareHospital) => {
			setActiveMarker(hospital.id);
			onHospitalSelect?.(hospital);
		},
		[onHospitalSelect]
	);

	const openInGoogleMaps = useCallback((lat: number, lng: number) => {
		window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank', 'noopener,noreferrer');
	}, []);

	const openDirections = useCallback((lat: number, lng: number) => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					const userLat = position.coords.latitude;
					const userLng = position.coords.longitude;
					window.open(
						`https://www.google.com/maps/dir/${userLat},${userLng}/${lat},${lng}`,
						'_blank',
						'noopener,noreferrer'
					);
				},
				() => {
					window.open(
						`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
						'_blank',
						'noopener,noreferrer'
					);
				}
			);
		} else {
			window.open(
				`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
				'_blank',
				'noopener,noreferrer'
			);
		}
	}, []);

	const mapOptions: google.maps.MapOptions = useMemo(
		() => ({
			disableDefaultUI: false,
			zoomControl: true,
			mapTypeControl: true,
			streetViewControl: true,
			fullscreenControl: true,
		}),
		[]
	);

	const getMarkerIcon = useCallback(
		(hospital: IcareHospital) => {
			const isSelected = selectedHospital?.id === hospital.id;
			const isHovered = hoveredMarker === hospital.id;
			const isActive = activeMarker === hospital.id;

			let fillColor = '#3b82f6';
			let scale = 1;

			if (isSelected || isActive) {
				fillColor = '#8b5cf6';
				scale = 1.2;
			} else if (isHovered) {
				fillColor = '#6366f1';
				scale = 1.1;
			}

			return {
				path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
				fillColor,
				fillOpacity: 1,
				strokeColor: '#ffffff',
				strokeWeight: 2,
				scale: scale * 1.5,
				anchor: new google.maps.Point(12, 22),
			};
		},
		[selectedHospital, hoveredMarker, activeMarker]
	);

	if (loadError) {
		return (
			<div className={styles.statusContainer} style={{ height }}>
				<MapPin className={`${styles.statusIcon} ${styles.error}`} />
				<h3 className={styles.statusTitle}>Map Loading Error</h3>
				<p className={styles.statusMessage}>
					Unable to load Google Maps. Please verify your API key is valid and has Maps
					JavaScript API enabled.
				</p>
			</div>
		);
	}

	if (!isLoaded) {
		return (
			<div className={styles.statusContainer} style={{ height }}>
				<div className={styles.loadingSpinner} />
				<p className={styles.statusMessage}>Loading Google Maps...</p>
			</div>
		);
	}

	if (hospitals.length === 0) {
		return (
			<div className={styles.statusContainer} style={{ height }}>
				<MapPin className={`${styles.statusIcon} ${styles.muted}`} />
				<h3 className={styles.statusTitle}>No hospitals to display</h3>
				<p className={styles.statusMessage}>Add hospitals to see them on the map</p>
			</div>
		);
	}

	return (
		<div className={styles.mapContainer}>
			<div className={styles.mapHeader}>
				<div className={styles.headerTitle}>
					<h3 className={styles.titleRow}>
						<div className={styles.iconBox}>
							<MapPin className={styles.headerIcon} />
						</div>
						Hospital Locations
					</h3>
					<div className={styles.locationText}>
						<span className={styles.coordinates}>
							<div className={styles.coordinatesDot} />
							{mapCenter.lat.toFixed(4)}, {mapCenter.lng.toFixed(4)}
						</span>
					</div>
				</div>
			</div>

			<div className={styles.mapBody} style={{ height: `calc(${height} - 120px)` }}>
				<GoogleMap
					mapContainerStyle={containerStyle}
					center={mapCenter}
					zoom={13}
					onLoad={onLoad}
					onUnmount={onUnmount}
					options={mapOptions}
				>
					{hospitals.map((hospital) => (
						<Marker
							key={hospital.id}
							position={hospital.coordinates}
							icon={getMarkerIcon(hospital)}
							onClick={() => handleMarkerClick(hospital)}
							onMouseOver={() => setHoveredMarker(hospital.id)}
							onMouseOut={() => setHoveredMarker(null)}
						/>
					))}

					{activeMarker && (
						<InfoWindow
							position={hospitals.find((h) => h.id === activeMarker)?.coordinates}
							onCloseClick={() => setActiveMarker(null)}
							options={{
								pixelOffset: new google.maps.Size(0, -30),
							}}
						>
							<div className={styles.infoWindowContainer}>
								{(() => {
									const hospital = hospitals.find((h) => h.id === activeMarker);
									if (!hospital) return null;

									return (
										<div className={styles.hospitalInfo}>
											<div className={styles.infoHeader}>
												<h4 className={styles.hospitalName}>
													{hospital.name}
												</h4>
												<p className={styles.hospitalAddress}>
													<MapPin className={styles.addressIcon} />
													{hospital.location}
												</p>
												{hospital.address && (
													<p className={styles.hospitalAddress}>
														<span className={styles.addressSpacer} />
														{hospital.address}
													</p>
												)}
											</div>

											<div className={styles.statsGrid}>
												<div className={styles.statItem}>
													<span className={styles.statLabel}>
														Rating
													</span>
													<div className={styles.statValue}>
														<Star className={styles.ratingIcon} />
														{hospital.rating}/5
													</div>
												</div>

												{hospital.phone && (
													<div
														className={`${styles.statItem} ${styles.statDivider}`}
													>
														<span className={styles.statLabel}>
															Contact
														</span>
														<div
															className={`${styles.statValue} ${styles.contact}`}
														>
															<Phone className={styles.phoneIcon} />
															Call
														</div>
													</div>
												)}
											</div>

											{hospital.specialties &&
												hospital.specialties.length > 0 && (
													<div className={styles.specialtiesContainer}>
														<div className={styles.statLabel}>
															Top Specialties
														</div>
														<div className={styles.specialtiesList}>
															{hospital.specialties
																.slice(0, 3)
																.map((specialty, idx) => (
																	<span
																		key={idx}
																		className={
																			styles.specialtyTag
																		}
																	>
																		{specialty}
																	</span>
																))}
															{hospital.specialties.length > 3 && (
																<span className={styles.moreTag}>
																	+
																	{hospital.specialties.length -
																		3}{' '}
																	more
																</span>
															)}
														</div>
													</div>
												)}

											<div className={styles.actionsGrid}>
												<button
													onClick={() =>
														openInGoogleMaps(
															hospital.coordinates.lat,
															hospital.coordinates.lng
														)
													}
													className={`${styles.actionButton} ${styles.btnSecondary}`}
												>
													<ExternalLink className={styles.actionIcon} />
													Open Maps
												</button>
												<button
													onClick={() =>
														openDirections(
															hospital.coordinates.lat,
															hospital.coordinates.lng
														)
													}
													className={`${styles.actionButton} ${styles.btnPrimary}`}
												>
													<Navigation className={styles.actionIcon} />
													Directions
												</button>
											</div>
										</div>
									);
								})()}
							</div>
						</InfoWindow>
					)}
				</GoogleMap>
			</div>

			<div className={styles.mapFooter}>
				<div className={styles.legendItems}>
					<div className={styles.legendItem}>
						<div className={`${styles.legendDot} ${styles.blue}`} />
						<span className={styles.legendText}>Hospital</span>
					</div>
					<div className={styles.legendItem}>
						<div className={`${styles.legendDot} ${styles.indigo}`} />
						<span className={styles.legendText}>Hovered</span>
					</div>
					<div className={styles.legendItem}>
						<div className={`${styles.legendDot} ${styles.violet}`} />
						<span className={styles.legendText}>Selected</span>
					</div>
				</div>
				<p className={styles.legendText} style={{ color: 'var(--gray-400)' }}>
					Click markers for details
				</p>
			</div>
		</div>
	);
}

export default HospitalMap;