'use client';

import {
	AlertCircle,
	ArrowLeft,
	Briefcase,
	Building2,
	Calendar,
	Camera,
	Code,
	Globe,
	Laptop,
	Monitor,
	Settings,
	Share2,
	Sparkles,
	User,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './CameraBlogPage.module.css';

const CameraBlogPage = () => {
	const router = useRouter();
	const [imageError, setImageError] = useState(false);
	const [isWindows, setIsWindows] = useState(false);

	useEffect(() => {
		// Detect if running on Windows
		setIsWindows(navigator.platform.toLowerCase().includes('win'));
	}, []);

	const openWindowsCameraSettings = () => {
		if (isWindows) {
			// Try to open Windows camera settings directly
			window.location.href = 'ms-settings:camera';
		} else {
			alert('This feature is only available on Windows 11.');
		}
	};

	const handleShare = async () => {
		if (navigator.share) {
			try {
				await navigator.share({
					title: 'Camera Conflict Resolution - oLo Eye Health Monitor',
					text: 'Learn how to fix camera conflicts in Windows 11 and enable multi-app camera support for seamless eye tracking',
					url: window.location.href,
				});
			} catch (err) {
				console.log('Share cancelled or failed');
			}
		} else {
			// Fallback: Copy to clipboard
			try {
				await navigator.clipboard.writeText(window.location.href);
				alert('Link copied to clipboard!');
			} catch (err) {
				console.error('Failed to copy link');
			}
		}
	};

	return (
		<div className={styles.blogContainer}>
			{/* Header */}
			<header className={styles.header}>
				<button onClick={() => router.back()} className={styles.backButton}>
					<ArrowLeft size={20} />
					Back
				</button>
				<button onClick={handleShare} className={styles.shareButton}>
					<Share2 size={20} />
					Share
				</button>
			</header>

			{/* Article */}
			<article className={styles.article}>
				{/* Hero Section */}
				<div className={styles.heroSection}>
					<div className={styles.categoryBadge}>
						<Camera size={16} />
						<span>Camera Issues</span>
						<span className={styles.separator}>•</span>
						<span>Windows 11</span>
						<span className={styles.separator}>•</span>
						<span>Professional Guide</span>
					</div>

					<h1 className={styles.title}>
						Fix Camera Conflicts for Seamless Multi-Tasking: A Complete Guide for
						Professionals
					</h1>

					<p className={styles.subtitle}>
						Enable Windows 11's multi-app camera support to run oLo alongside video
						conferencing, screen recording, and other productivity tools—essential for
						modern office workers worldwide.
					</p>

					<div className={styles.meta}>
						<div className={styles.metaItem}>
							<Calendar size={16} />
							<span>December 19, 2024</span>
						</div>
						<div className={styles.metaItem}>
							<User size={16} />
							<span>oLo Health Team</span>
						</div>
						<div className={styles.readTime}>
							<span>6 min read</span>
						</div>
					</div>
				</div>

				{/* Featured Image */}
				<div className={styles.featuredImage}>
					{!imageError ? (
						<Image
							src="https://i0.wp.com/robquickenden.blog/wp-content/uploads/2024/12/image-31.png?w=1286&ssl=1"
							alt="Windows 11 Advanced Camera Settings - Multi-App Support"
							width={1286}
							height={800}
							className={styles.image}
							onError={() => setImageError(true)}
							priority
							unoptimized
						/>
					) : (
						<div className={styles.imageFallback}>
							<Camera size={64} className={styles.fallbackIcon} />
							<p>Windows 11 Advanced Camera Settings</p>
							<span className={styles.fallbackSubtext}>
								Multi-App Camera Support Configuration
							</span>
						</div>
					)}
				</div>

				{/* Content */}
				<div className={styles.content}>
					{/* Quick Action Box */}
					<div className={styles.quickActionBox}>
						<Sparkles className={styles.quickActionIcon} size={28} />
						<div className={styles.quickActionContent}>
							<h3>Quick Fix: Open Camera Settings Now</h3>
							<p>
								Running Windows 11? Click below to open camera settings directly and
								enable multi-app support in seconds.
							</p>
							{isWindows ? (
								<button
									onClick={openWindowsCameraSettings}
									className={styles.primaryActionButton}
								>
									<Settings size={20} />
									Open Camera Settings
								</button>
							) : (
								<div className={styles.notWindowsMessage}>
									<p>
										⚠️ This direct link only works on Windows 11. Follow the
										manual steps below.
									</p>
								</div>
							)}
						</div>
					</div>

					{/* Alert Box */}
					<div className={styles.alertBox}>
						<AlertCircle size={24} />
						<div>
							<h3>Camera Conflict Affecting Your Productivity?</h3>
							<p>
								If you're experiencing camera conflicts with oLo, you're not alone.
								This issue affects millions of office workers, developers, content
								creators, and remote professionals worldwide. The good news? Windows
								11 has a built-in solution.
							</p>
						</div>
					</div>

					{/* Who This Affects */}
					<section className={styles.section}>
						<h2>Who This Guide Is For</h2>
						<p className={styles.lead}>
							This solution is essential for every professional who uses their
							computer for extended periods—from corporate employees to freelancers,
							from IT specialists to creative professionals.
						</p>

						<div className={styles.professionalGrid}>
							<div className={styles.professionalCard}>
								<Briefcase size={32} className={styles.professionalIcon} />
								<h4>Office Professionals</h4>
								<p>
									Corporate employees, managers, executives, and administrators
									working in offices worldwide
								</p>
							</div>

							<div className={styles.professionalCard}>
								<Monitor size={32} className={styles.professionalIcon} />
								<h4>Remote Workers</h4>
								<p>
									Work-from-home professionals, digital nomads, and distributed
									team members
								</p>
							</div>

							<div className={styles.professionalCard}>
								<Code size={32} className={styles.professionalIcon} />
								<h4>Developers & IT</h4>
								<p>
									Software developers, programmers, system administrators, and
									tech support specialists
								</p>
							</div>

							<div className={styles.professionalCard}>
								<Laptop size={32} className={styles.professionalIcon} />
								<h4>Content Creators</h4>
								<p>
									Writers, designers, video editors, marketers, and social media
									professionals
								</p>
							</div>

							<div className={styles.professionalCard}>
								<Building2 size={32} className={styles.professionalIcon} />
								<h4>Enterprise Teams</h4>
								<p>
									Large corporations, government agencies, educational
									institutions, and healthcare organizations
								</p>
							</div>

							<div className={styles.professionalCard}>
								<Globe size={32} className={styles.professionalIcon} />
								<h4>Global Workforce</h4>
								<p>
									Professionals across industries, genders, and locations—anyone
									who works on a computer
								</p>
							</div>
						</div>
					</section>

					{/* Understanding the Problem */}
					<section className={styles.section}>
						<h2>The Camera Conflict Problem</h2>
						<p className={styles.lead}>
							Windows traditionally allowed only one application to access your camera
							at a time. This creates serious productivity bottlenecks for modern
							professionals who need to:
						</p>

						<div className={styles.problemList}>
							<div className={styles.problemItem}>
								<span className={styles.problemIcon}>💼</span>
								<div>
									<strong>Attend Video Meetings</strong>
									<p>
										Join Zoom, Microsoft Teams, or Google Meet calls while
										monitoring eye health
									</p>
								</div>
							</div>

							<div className={styles.problemItem}>
								<span className={styles.problemIcon}>📹</span>
								<div>
									<strong>Record Training Content</strong>
									<p>
										Create tutorials, demos, or presentations with webcam
										overlay
									</p>
								</div>
							</div>

							<div className={styles.problemItem}>
								<span className={styles.problemIcon}>🎯</span>
								<div>
									<strong>Use Accessibility Tools</strong>
									<p>
										Run eye-tracking, screen readers, or other assistive
										technologies
									</p>
								</div>
							</div>

							<div className={styles.problemItem}>
								<span className={styles.problemIcon}>👁️</span>
								<div>
									<strong>Monitor Eye Health</strong>
									<p>
										Keep oLo running for continuous eye strain prevention and
										wellness tracking
									</p>
								</div>
							</div>
						</div>
					</section>

					{/* Why oLo Matters */}
					<section className={styles.section}>
						<div className={styles.oloImportanceBox}>
							<h2>Why Eye Health Monitoring Matters for Every Professional</h2>
							<p>
								Whether you're a man or woman, working from home or in a high-rise
								office, oLo protects your vision during the 8+ hours most
								professionals spend in front of screens daily.
							</p>

							<div className={styles.statisticsGrid}>
								<div className={styles.statCard}>
									<div className={styles.statNumber}>65%</div>
									<div className={styles.statLabel}>
										of office workers experience digital eye strain
									</div>
								</div>

								<div className={styles.statCard}>
									<div className={styles.statNumber}>8-12hrs</div>
									<div className={styles.statLabel}>
										average daily screen time for professionals
									</div>
								</div>

								<div className={styles.statCard}>
									<div className={styles.statNumber}>10-15x</div>
									<div className={styles.statLabel}>
										reduced blink rate during computer work
									</div>
								</div>

								<div className={styles.statCard}>
									<div className={styles.statNumber}>100%</div>
									<div className={styles.statLabel}>
										preventable with proper monitoring & breaks
									</div>
								</div>
							</div>
						</div>
					</section>

					{/* The Solution */}
					<section className={styles.section}>
						<div className={styles.highlightBox}>
							<h2>✨ The Solution: Windows 11 Multi-App Camera Support</h2>
							<p>
								Microsoft's groundbreaking new feature allows multiple applications
								to access your camera simultaneously. This means you can run oLo's
								eye-tracking while using any other camera-dependent application—no
								more choosing between productivity and eye health.
							</p>
						</div>
					</section>

					{/* Benefits for Professionals */}
					<section className={styles.section}>
						<h2>Professional Benefits</h2>

						<div className={styles.benefitCard}>
							<div className={styles.benefitIcon}>🎯</div>
							<div>
								<h3>Uninterrupted Productivity</h3>
								<p>
									Attend back-to-back video meetings while oLo continuously
									monitors your blink rate, eye strain, and screen distance—no
									need to disable monitoring or switch apps.
								</p>
							</div>
						</div>

						<div className={styles.benefitCard}>
							<div className={styles.benefitIcon}>💼</div>
							<div>
								<h3>Enterprise-Ready Solution</h3>
								<p>
									Perfect for large organizations deploying oLo across
									departments. IT teams can enable multi-app support
									organization-wide for seamless integration.
								</p>
							</div>
						</div>

						<div className={styles.benefitCard}>
							<div className={styles.benefitIcon}>🌍</div>
							<div>
								<h3>Global Accessibility</h3>
								<p>
									Works for all professionals regardless of location, industry, or
									role. Whether you're in Tokyo, New York, London, or Mumbai—the
									solution is universal.
								</p>
							</div>
						</div>

						<div className={styles.benefitCard}>
							<div className={styles.benefitIcon}>⚡</div>
							<div>
								<h3>Performance Optimized</h3>
								<p>
									Windows manages camera resources efficiently, ensuring smooth
									performance even when multiple applications share camera access.
								</p>
							</div>
						</div>
					</section>

					{/* Step-by-Step Guide */}
					<section className={styles.section}>
						<h2>Complete Setup Guide</h2>

						<div className={styles.requirementBox}>
							<strong>📋 Requirements:</strong>
							<ul>
								<li>
									Windows 11 (Insider Preview Build 26120.2702 or later
									recommended)
								</li>
								<li>Compatible webcam (built-in or external)</li>
								<li>Administrator access to system settings</li>
								<li>oLo installed and updated to the latest version</li>
							</ul>
						</div>

						<div className={styles.stepsContainer}>
							<h3>Implementation Steps:</h3>

							<div className={styles.step}>
								<div className={styles.stepNumber}>1</div>
								<div className={styles.stepContent}>
									<h4>Access Windows Settings</h4>
									<p>
										Press <kbd>Win</kbd> + <kbd>I</kbd> on your keyboard, or
										click the Start menu → Settings
									</p>
									{isWindows && (
										<button
											onClick={openWindowsCameraSettings}
											className={styles.stepActionButton}
										>
											<Settings size={16} />
											Quick Open Camera Settings
										</button>
									)}
								</div>
							</div>

							<div className={styles.step}>
								<div className={styles.stepNumber}>2</div>
								<div className={styles.stepContent}>
									<h4>Navigate to Camera Settings</h4>
									<p>Follow this path exactly:</p>
									<div className={styles.pathBox}>
										<code>Bluetooth & devices</code>
										<span className={styles.pathArrow}>›</span>
										<code>Cameras</code>
										<span className={styles.pathArrow}>›</span>
										<code>[Your Camera Name]</code>
									</div>
									<p className={styles.stepNote}>
										💡 Your camera might be labeled as "Integrated Camera",
										"Surface Camera Front", "HP HD Camera", or your webcam's
										brand name (e.g., "Logitech C920")
									</p>
								</div>
							</div>

							<div className={styles.step}>
								<div className={styles.stepNumber}>3</div>
								<div className={styles.stepContent}>
									<h4>Enable Multi-App Support</h4>
									<p>
										Locate and toggle ON:{' '}
										<strong>
											"Allow multiple apps to use camera at the same time"
										</strong>
									</p>
									<div className={styles.warningBox}>
										<AlertCircle size={18} />
										<p>
											<strong>Important:</strong> When enabled, some advanced
											camera controls (like blur effects or creative filters)
											may only be adjustable from the camera settings page,
											not from individual apps.
										</p>
									</div>
								</div>
							</div>

							<div className={styles.step}>
								<div className={styles.stepNumber}>4</div>
								<div className={styles.stepContent}>
									<h4>Optional: Enable Basic Camera Mode</h4>
									<p>
										For older webcams or stability issues, also toggle ON:{' '}
										<strong>"Turn on basic camera"</strong>
									</p>
									<p className={styles.stepNote}>
										This limits camera features to essentials, improving
										compatibility and stability
									</p>
								</div>
							</div>

							<div className={styles.step}>
								<div className={styles.stepNumber}>5</div>
								<div className={styles.stepContent}>
									<h4>Apply Changes</h4>
									<p>
										Click <strong>"Apply"</strong> at the bottom of the settings
										page
									</p>
								</div>
							</div>

							<div className={styles.step}>
								<div className={styles.stepNumber}>6</div>
								<div className={styles.stepContent}>
									<h4>Restart oLo</h4>
									<p>
										Close and reopen the oLo application to ensure it recognizes
										the new camera settings
									</p>
								</div>
							</div>

							<div className={styles.step}>
								<div className={styles.stepNumber}>7</div>
								<div className={styles.stepContent}>
									<h4>Verify Setup</h4>
									<p>Test the configuration:</p>
									<ol className={styles.verificationList}>
										<li>Start oLo's eye tracking</li>
										<li>
											Open another camera app (Camera app, Teams, Zoom, etc.)
										</li>
										<li>
											Confirm both applications can access the camera
											simultaneously
										</li>
										<li>Check oLo continues tracking without interruption</li>
									</ol>
								</div>
							</div>
						</div>
					</section>

					{/* Industry Use Cases */}
					<section className={styles.section}>
						<h2>Real-World Applications Across Industries</h2>

						<div className={styles.industryGrid}>
							<div className={styles.industryCard}>
								<h4>🏢 Corporate Offices</h4>
								<p>
									<strong>Scenario:</strong> HR conducting virtual interviews
									while tracking recruiter eye strain
								</p>
								<p>
									<strong>Solution:</strong> oLo monitors eye health during
									consecutive 6-8 hour interview days
								</p>
							</div>

							<div className={styles.industryCard}>
								<h4>💻 Software Development</h4>
								<p>
									<strong>Scenario:</strong> Developers in pair programming
									sessions or code reviews via video
								</p>
								<p>
									<strong>Solution:</strong> Continuous eye tracking during 10-12
									hour coding marathons
								</p>
							</div>

							<div className={styles.industryCard}>
								<h4>📊 Financial Services</h4>
								<p>
									<strong>Scenario:</strong> Analysts presenting quarterly reports
									while monitoring screen distance
								</p>
								<p>
									<strong>Solution:</strong> Real-time posture and eye strain
									alerts during critical presentations
								</p>
							</div>

							<div className={styles.industryCard}>
								<h4>🎓 Education & Training</h4>
								<p>
									<strong>Scenario:</strong> Teachers delivering online lessons
									throughout the school day
								</p>
								<p>
									<strong>Solution:</strong> oLo tracks blink rate and suggests
									breaks between classes
								</p>
							</div>

							<div className={styles.industryCard}>
								<h4>🏥 Healthcare</h4>
								<p>
									<strong>Scenario:</strong> Telemedicine consultations with
									electronic health records
								</p>
								<p>
									<strong>Solution:</strong> Eye health monitoring during extended
									patient video consultations
								</p>
							</div>

							<div className={styles.industryCard}>
								<h4>🎨 Creative Agencies</h4>
								<p>
									<strong>Scenario:</strong> Designers presenting work to clients
									while recording sessions
								</p>
								<p>
									<strong>Solution:</strong> Continuous monitoring during long
									creative review meetings
								</p>
							</div>

							<div className={styles.industryCard}>
								<h4>📱 Customer Support</h4>
								<p>
									<strong>Scenario:</strong> Support teams handling video calls
									throughout their shift
								</p>
								<p>
									<strong>Solution:</strong> 8-hour eye strain prevention with
									automated break reminders
								</p>
							</div>

							<div className={styles.industryCard}>
								<h4>🌐 Global Teams</h4>
								<p>
									<strong>Scenario:</strong> Distributed teams in different time
									zones collaborating
								</p>
								<p>
									<strong>Solution:</strong> 24/7 eye health tracking across all
									team members worldwide
								</p>
							</div>
						</div>
					</section>

					{/* Gender Inclusive Message */}
					<section className={styles.section}>
						<div className={styles.inclusiveBox}>
							<h2>Eye Health Affects Everyone Equally</h2>
							<p>
								Digital eye strain doesn't discriminate. Whether you're a male
								executive, female developer, non-binary designer, or any
								professional in between—everyone who works on computers faces the
								same risks:
							</p>
							<ul className={styles.equalityList}>
								<li>
									<strong>Women in tech</strong> - Often overlooked in workplace
									wellness initiatives
								</li>
								<li>
									<strong>Male developers</strong> - Typically work longer hours
									with higher screen exposure
								</li>
								<li>
									<strong>Working parents</strong> - Juggling careers with family,
									spending 10+ hours on screens
								</li>
								<li>
									<strong>Young professionals</strong> - Building careers with
									intensive screen time
								</li>
								<li>
									<strong>Senior executives</strong> - Managing teams through
									endless video meetings
								</li>
							</ul>
							<p className={styles.inclusiveNote}>
								oLo is designed for every professional, regardless of gender, age,
								role, or industry. Your eye health matters.
							</p>
						</div>
					</section>

					{/* Troubleshooting */}
					<section className={styles.section}>
						<div className={styles.troubleshootingBox}>
							<h2>🔧 Troubleshooting Guide</h2>

							<div className={styles.troubleshootingStep}>
								<strong>Issue: Can't find "Allow multiple apps" setting</strong>
								<p>
									<strong>Solution:</strong> Update to Windows 11 Insider Preview
									Build 26120.2702 or later. Check Windows Update in Settings ›
									Windows Update.
								</p>
							</div>

							<div className={styles.troubleshootingStep}>
								<strong>Issue: Camera not appearing in Bluetooth & devices</strong>
								<p>
									<strong>Solution:</strong> Check Device Manager (Win + X ›
									Device Manager) under "Cameras" or "Imaging Devices". Update or
									reinstall camera drivers.
								</p>
							</div>

							<div className={styles.troubleshootingStep}>
								<strong>Issue: Setting enabled but apps still conflict</strong>
								<p>
									<strong>Solution:</strong> Restart your computer, then restart
									both oLo and the other camera app. Ensure both apps have camera
									permissions in Privacy settings.
								</p>
							</div>

							<div className={styles.troubleshootingStep}>
								<strong>Issue: Poor camera performance with multiple apps</strong>
								<p>
									<strong>Solution:</strong> Enable "Turn on basic camera" mode,
									reduce video quality in one app, or close unnecessary background
									applications.
								</p>
							</div>

							<div className={styles.troubleshootingStep}>
								<strong>Issue: oLo not detecting camera after enabling</strong>
								<p>
									<strong>Solution:</strong> Go to Settings › Privacy & Security ›
									Camera and verify oLo has permission. Toggle it off and on, then
									restart oLo.
								</p>
							</div>

							<div className={styles.troubleshootingStep}>
								<strong>For Enterprise IT Teams:</strong>
								<p>
									<strong>Deployment Tip:</strong> Use Group Policy or Intune to
									deploy this setting across your organization. Test with a pilot
									group before company-wide rollout.
								</p>
							</div>
						</div>
					</section>

					{/* About oLo - Premium Version */}
					<section className={styles.section}>
						<div className={styles.premiumOloBox}>
							<div className={styles.premiumOloHeader}>
								<Sparkles size={32} className={styles.premiumIcon} />
								<div>
									<h2>About oLo: Your Digital Eye Health Guardian</h2>
									<p className={styles.premiumTagline}>
										Professional-grade AI-powered eye health monitoring for the
										modern workforce
									</p>
								</div>
							</div>

							<p className={styles.premiumDescription}>
								oLo is trusted by professionals across 50+ countries and every major
								industry. Using advanced computer vision and MediaPipe AI
								algorithms, oLo provides real-time eye health monitoring tailored to
								your work habits and environment.
							</p>

							<div className={styles.premiumFeatures}>
								<div className={styles.premiumFeature}>
									<div className={styles.premiumFeatureIcon}>👁️</div>
									<strong>Real-Time Eye Tracking</strong>
									<p>
										Monitor blink rate, strain, fatigue, dryness, redness, and
										10+ other metrics
									</p>
								</div>

								<div className={styles.premiumFeature}>
									<div className={styles.premiumFeatureIcon}>🤖</div>
									<strong>AI-Powered Analysis</strong>
									<p>
										Machine learning algorithms detect patterns and predict eye
										strain before it happens
									</p>
								</div>

								<div className={styles.premiumFeature}>
									<div className={styles.premiumFeatureIcon}>📊</div>
									<strong>Professional Analytics</strong>
									<p>
										Hourly, daily, monthly, and yearly reports with actionable
										insights
									</p>
								</div>

								<div className={styles.premiumFeature}>
									<div className={styles.premiumFeatureIcon}>🔔</div>
									<strong>Smart Notifications</strong>
									<p>
										Context-aware alerts for breaks, posture, distance, and
										screen time
									</p>
								</div>

								<div className={styles.premiumFeature}>
									<div className={styles.premiumFeatureIcon}>🌍</div>
									<strong>Multi-Language Support</strong>
									<p>
										Available in English, Japanese, Korean, and expanding to
										more languages
									</p>
								</div>

								<div className={styles.premiumFeature}>
									<div className={styles.premiumFeatureIcon}>🔒</div>
									<strong>Privacy-First</strong>
									<p>
										All tracking happens locally on your device. Your data never
										leaves your computer
									</p>
								</div>
							</div>

							<div className={styles.premiumCTA}>
								<p>
									Join thousands of professionals worldwide who have reduced eye
									strain by 65% and improved productivity by 23% with oLo.
								</p>
							</div>
						</div>
					</section>
				</div>

				{/* Footer */}
				<footer className={styles.footer}>
					<div className={styles.tags}>
						<span className={styles.tag}>Windows 11</span>
						<span className={styles.tag}>Multi-App Camera</span>
						<span className={styles.tag}>oLo</span>
						<span className={styles.tag}>Eye Health</span>
						<span className={styles.tag}>Office Workers</span>
						<span className={styles.tag}>Remote Work</span>
						<span className={styles.tag}>Productivity</span>
						<span className={styles.tag}>Professional Wellness</span>
					</div>

					<div className={styles.footerInfo}>
						<p>
							© {new Date().getFullYear()} Aura Medical Technologies Inc. All
							rights reserved.
						</p>
						<p>
							oLo - Trusted by professionals worldwide for eye health monitoring and
							digital wellness
						</p>
					</div>
				</footer>
			</article>
		</div>
	);
};

export default CameraBlogPage;
