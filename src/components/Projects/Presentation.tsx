'use client';
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import pptxgenjs from 'pptxgenjs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import {
  Sparkles,
  FileText,
  Sliders,
  Zap,
  Brain,
  CheckCircle,
  ArrowRight,
  Lightbulb,
  Clock,
  Play,
  Settings,
  Wand2,
  MicIcon,
} from 'lucide-react';
import { m } from 'framer-motion';
import axios from 'axios';
import { useParams } from 'next/navigation';

interface PresentationForm {
  prompt: string;
  slideCount: number;
  tone: string;
  style: string;
}

export default function Presentation() {
  const { id: projectId }: { id: string } = useParams();
  const [formData, setFormData] = useState<PresentationForm>({
    prompt: '',
    slideCount: 10,
    tone: 'professional',
    style: 'modern',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tones = [
    { value: 'professional', label: 'Professional', icon: '💼' },
    { value: 'casual', label: 'Casual', icon: '😊' },
    { value: 'academic', label: 'Academic', icon: '🎓' },
    { value: 'creative', label: 'Creative', icon: '🎨' },
    { value: 'technical', label: 'Technical', icon: '⚙️' },
  ];

  const styles = [
    { value: 'modern', label: 'Modern', icon: '✨' },
    { value: 'minimal', label: 'Minimal', icon: '⚪' },
    { value: 'colorful', label: 'Colorful', icon: '🌈' },
    { value: 'elegant', label: 'Elegant', icon: '👑' },
    { value: 'corporate', label: 'Corporate', icon: '🏢' },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const handleGenerate = async () => {
    if (!window) return;

    setIsGenerating(true);
    setError(null);

    try {
      const response = await axios.post(
        '/api/presentation',
        {
          ...formData,
          projectId: Number(projectId),
        },
        {
          responseType: 'blob',
        },
      );

      // Create a blob URL for the downloaded file
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      });

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `presentation-${Date.now()}.pptx`;

      // Trigger download
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log('Presentation downloaded successfully');
    } catch (error: any) {
      console.error('Failed to generate presentation:', error);
      setError('Failed to generate presentation. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <m.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 p-4 md:p-8"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <m.div variants={itemVariants} className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="bg-gradient-to-r from-emerald-100 to-blue-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              AI-Powered Presentation Generator
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Create Stunning
            <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              {' '}
              Presentations
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform your ideas into beautiful, professional presentations in
            seconds. Our AI understands your content and creates engaging slides
            that captivate your audience.
          </p>
        </m.div>

        {/* Stats Section */}
        {/* <m.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
					<div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
						<div className="flex items-center gap-3 mb-2">
							<Zap className="w-6 h-6 text-emerald-600" />
							<span className="text-2xl font-bold text-gray-900">30s</span>
						</div>
						<p className="text-sm text-gray-600">Generation Time</p>
					</div>
					<div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
						<div className="flex items-center gap-3 mb-2">
							<Brain className="w-6 h-6 text-blue-600" />
							<span className="text-2xl font-bold text-gray-900">AI</span>
						</div>
						<p className="text-sm text-gray-600">Powered</p>
					</div>
					<div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
						<div className="flex items-center gap-3 mb-2">
							<Star className="w-6 h-6 text-purple-600" />
							<span className="text-2xl font-bold text-gray-900">4.9/5</span>
						</div>
						<p className="text-sm text-gray-600">User Rating</p>
					</div>
					<div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
						<div className="flex items-center gap-3 mb-2">
							<TrendingUp className="w-6 h-6 text-orange-600" />
							<span className="text-2xl font-bold text-gray-900">10K+</span>
						</div>
						<p className="text-sm text-gray-600">Presentations Created</p>
					</div>
				</m.div> */}

        {/* Main Form Section */}
        <m.div
          variants={itemVariants}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Form Card */}
          <div className="lg:col-span-2">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl">
              <CardHeader className="pb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg">
                    <Wand2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900">
                      Presentation Details
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Describe your presentation and customize the settings
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Prompt Input */}
                <div className="space-y-2">
                  <Label
                    htmlFor="prompt"
                    className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    Presentation Topic & Content
                  </Label>
                  <Textarea
                    id="prompt"
                    placeholder="Describe your presentation topic, key points, target audience, and any specific requirements. For example: 'Create a presentation about renewable energy for a business audience covering solar power, wind energy, and future trends.'"
                    value={formData.prompt}
                    onChange={(e) =>
                      setFormData({ ...formData, prompt: e.target.value })
                    }
                    className="min-h-[120px] resize-none border-2 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl text-base"
                  />
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Lightbulb className="w-3 h-3" />
                    <span>
                      Be specific for better results. Include your topic, key
                      points, and audience.
                    </span>
                  </div>
                </div>

                {/* Slide Count */}
                <div className="space-y-2">
                  <Label
                    htmlFor="slideCount"
                    className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                  >
                    <Sliders className="w-4 h-4" />
                    Number of Slides
                  </Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="slideCount"
                      type="number"
                      min="1"
                      max="50"
                      value={formData.slideCount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          slideCount: parseInt(e.target.value) || 1,
                        })
                      }
                      className="w-24 border-2 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl text-center font-semibold"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>1</span>
                        <span>25</span>
                        <span>50</span>
                      </div>
                      <div
                        className="w-full bg-gray-200 rounded-full h-2 cursor-pointer relative"
                        onClick={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const clickX = e.clientX - rect.left;
                          const percentage = (clickX / rect.width) * 100;
                          const newSlideCount = Math.max(
                            1,
                            Math.min(50, Math.round((percentage / 100) * 50)),
                          );
                          setFormData({
                            ...formData,
                            slideCount: newSlideCount,
                          });
                        }}
                        onMouseDown={(e) => {
                          const slider = e.currentTarget;
                          const rect = slider.getBoundingClientRect();

                          const handleMouseMove = (moveEvent: MouseEvent) => {
                            const clickX = moveEvent.clientX - rect.left;
                            const percentage = Math.max(
                              0,
                              Math.min(100, (clickX / rect.width) * 100),
                            );
                            const newSlideCount = Math.max(
                              1,
                              Math.min(50, Math.round((percentage / 100) * 50)),
                            );
                            setFormData({
                              ...formData,
                              slideCount: newSlideCount,
                            });
                          };

                          const handleMouseUp = () => {
                            document.removeEventListener(
                              'mousemove',
                              handleMouseMove,
                            );
                            document.removeEventListener(
                              'mouseup',
                              handleMouseUp,
                            );
                          };

                          document.addEventListener(
                            'mousemove',
                            handleMouseMove,
                          );
                          document.addEventListener('mouseup', handleMouseUp);
                        }}
                      >
                        <div
                          className="bg-gradient-to-r from-emerald-500 to-blue-500 h-2 rounded-full transition-all duration-100 relative"
                          style={{
                            width: `${(formData.slideCount / 50) * 100}%`,
                          }}
                        >
                          <div className="absolute -right-1 -top-1 w-4 h-4 bg-white border-2 border-emerald-500 rounded-full shadow-md hover:scale-110 transition-transform duration-200"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tone Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <MicIcon className="w-4 h-4" />
                    Presentation Tone
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {tones.map((tone) => (
                      <button
                        key={tone.value}
                        onClick={() =>
                          setFormData({ ...formData, tone: tone.value })
                        }
                        className={`p-3 rounded-xl border-2 transition-all duration-200 text-sm font-medium ${
                          formData.tone === tone.value
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                            : 'border-gray-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/50'
                        }`}
                      >
                        <div className="text-lg mb-1">{tone.icon}</div>
                        {tone.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Style Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Visual Style
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {styles.map((style) => (
                      <button
                        key={style.value}
                        onClick={() =>
                          setFormData({ ...formData, style: style.value })
                        }
                        className={`p-3 rounded-xl border-2 transition-all duration-200 text-sm font-medium ${
                          formData.style === style.value
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                            : 'border-gray-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/50'
                        }`}
                      >
                        <div className="text-lg mb-1">{style.icon}</div>
                        {style.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Generate Button */}
                <div className="pt-4 space-y-3">
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  )}
                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full py-4 px-8 rounded-xl font-semibold text-lg bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Generating Presentation...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Generate Presentation
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Features Card */}
          <div className="space-y-6">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  What You&apos;ll Get
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-1 bg-emerald-100 rounded-full">
                    <FileText className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Professional Slides
                    </p>
                    <p className="text-sm text-gray-600">
                      Clean, modern design with proper formatting
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-1 bg-blue-100 rounded-full">
                    <Brain className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      AI-Generated Content
                    </p>
                    <p className="text-sm text-gray-600">
                      Smart content organization and bullet points
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-1 bg-purple-100 rounded-full">
                    <Zap className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Instant Generation
                    </p>
                    <p className="text-sm text-gray-600">
                      Ready in 30 seconds or less
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-1 bg-orange-100 rounded-full">
                    <Play className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Presentation Ready
                    </p>
                    <p className="text-sm text-gray-600">
                      Export to PowerPoint or PDF
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-50 to-blue-50 border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-emerald-600" />
                  Quick Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-700">
                    Be specific about your topic and key points
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-700">
                    Mention your target audience for better content
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-700">
                    Choose the right tone for your audience
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-700">
                    10-15 slides work best for most presentations
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </m.div>

        {/* Bottom Features */}
        {/* <m.div variants={itemVariants} className="mt-16 text-center">
					<h2 className="text-2xl font-bold text-gray-900 mb-8">
						Why Choose Our AI Presentation Generator?
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg">
							<div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
								<Zap className="w-6 h-6 text-white" />
							</div>
							<h3 className="text-lg font-bold text-gray-900 mb-2">Lightning Fast</h3>
							<p className="text-gray-600">Generate professional presentations in under 30 seconds</p>
						</div>
						<div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg">
							<div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
								<Brain className="w-6 h-6 text-white" />
							</div>
							<h3 className="text-lg font-bold text-gray-900 mb-2">AI-Powered</h3>
							<p className="text-gray-600">Advanced AI that understands context and creates engaging content</p>
						</div>
						<div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg">
							<div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
								<Star className="w-6 h-6 text-white" />
							</div>
							<h3 className="text-lg font-bold text-gray-900 mb-2">Professional Quality</h3>
							<p className="text-gray-600">Designs that look like they were created by expert designers</p>
						</div>
					</div>
				</m.div> */}
      </div>
    </m.div>
  );
}
