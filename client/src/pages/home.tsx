import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Sparkles, User, Calendar, Clock, Brain, BookOpen, Lightbulb, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { predictionRequestSchema, type PredictionRequest, type PredictionResult, mbtiTypes } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

const years = Array.from({ length: new Date().getFullYear() - 1955 + 1 }, (_, i) => (new Date().getFullYear() - i).toString());
const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, "0"));
const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, "0"));
const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, "0"));

export default function Home() {
  const { toast } = useToast();
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [activeSection, setActiveSection] = useState<string>("sajuAnalysis");

  const form = useForm<PredictionRequest>({
    resolver: zodResolver(predictionRequestSchema),
    defaultValues: {
      name: "",
      gender: undefined,
      birthYear: "",
      birthMonth: "",
      birthDay: "",
      birthHour: "",
      birthPeriod: undefined,
      calendarType: undefined,
      mbti: undefined,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: PredictionRequest) => {
      const response = await apiRequest("POST", "/api/predict", data);
      return response.json();
    },
    onSuccess: (data: PredictionResult) => {
      setResult(data);
      toast({
        title: "분석 완료",
        description: `${data.studentName}님의 학습 스타일 분석이 완료되었습니다.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "분석 실패",
        description: error.message || "분석 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PredictionRequest) => {
    mutation.mutate(data);
  };

  const sidebarItems = [
    { id: "sajuAnalysis", label: "사주 분석", icon: Calendar },
    { id: "mbtiAnalysis", label: "MBTI 분석", icon: Brain },
    { id: "learningStyle", label: "학습 스타일", icon: Sparkles },
    { id: "recommendations", label: "학습 추천", icon: BookOpen },
    { id: "tips", label: "맞춤 조언", icon: Lightbulb },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <header className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              AI 학생학습 스타일 예측기
            </h1>
          </div>
          <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto">
            사주와 MBTI를 기반으로 학생의 학습 스타일과 성과를 AI가 분석해드립니다
          </p>
        </header>

        <Card className="mb-8">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              학생 정보 입력
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          이름
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="학생 이름을 입력하세요" 
                            data-testid="input-name"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          성별
                        </FormLabel>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant={field.value === "male" ? "default" : "outline"}
                            className="flex-1"
                            onClick={() => field.onChange("male")}
                            data-testid="button-gender-male"
                          >
                            남자
                          </Button>
                          <Button
                            type="button"
                            variant={field.value === "female" ? "default" : "outline"}
                            className="flex-1"
                            onClick={() => field.onChange("female")}
                            data-testid="button-gender-female"
                          >
                            여자
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <Calendar className="w-4 h-4" />
                    사주 (생년월일시)
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <FormField
                      control={form.control}
                      name="birthYear"
                      render={({ field }) => (
                        <FormItem>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-year">
                                <SelectValue placeholder="년" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {years.map((year) => (
                                <SelectItem key={year} value={year}>
                                  {year}년
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="birthMonth"
                      render={({ field }) => (
                        <FormItem>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-month">
                                <SelectValue placeholder="월" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {months.map((month) => (
                                <SelectItem key={month} value={month}>
                                  {month}월
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="birthDay"
                      render={({ field }) => (
                        <FormItem>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-day">
                                <SelectValue placeholder="일" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {days.map((day) => (
                                <SelectItem key={day} value={day}>
                                  {day}일
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="birthHour"
                      render={({ field }) => (
                        <FormItem>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-hour">
                                <SelectValue placeholder="시" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {hours.map((hour) => (
                                <SelectItem key={hour} value={hour}>
                                  {hour}시
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="calendarType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            양력/음력
                          </FormLabel>
                          <div className="grid grid-cols-2 gap-3">
                            <Button
                              type="button"
                              variant={field.value === "solar" ? "default" : "outline"}
                              className="w-full"
                              onClick={() => field.onChange("solar")}
                              data-testid="button-solar"
                            >
                              양력
                            </Button>
                            <Button
                              type="button"
                              variant={field.value === "lunar" ? "default" : "outline"}
                              className="w-full"
                              onClick={() => field.onChange("lunar")}
                              data-testid="button-lunar"
                            >
                              음력
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="birthPeriod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            오전/오후
                          </FormLabel>
                          <div className="grid grid-cols-2 gap-3">
                            <Button
                              type="button"
                              variant={field.value === "AM" ? "default" : "outline"}
                              className="w-full"
                              onClick={() => field.onChange("AM")}
                              data-testid="button-am"
                            >
                              오전 (AM)
                            </Button>
                            <Button
                              type="button"
                              variant={field.value === "PM" ? "default" : "outline"}
                              className="w-full"
                              onClick={() => field.onChange("PM")}
                              data-testid="button-pm"
                            >
                              오후 (PM)
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="mbti"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Brain className="w-4 h-4" />
                        MBTI
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-mbti">
                            <SelectValue placeholder="MBTI 유형을 선택하세요" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mbtiTypes.map((mbti) => (
                            <SelectItem key={mbti} value={mbti}>
                              {mbti}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={mutation.isPending}
                  data-testid="button-predict"
                >
                  {mutation.isPending ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      AI 분석 중...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      AI 예측분석하기
                    </span>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {result && (
          <Card data-testid="card-result">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                {result.studentName}님의 학습 스타일 분석 결과
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                분석 일시: {new Date(result.timestamp).toLocaleString("ko-KR")}
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-64 shrink-0">
                  <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
                    {sidebarItems.map((item) => (
                      <Button
                        key={item.id}
                        variant={activeSection === item.id ? "secondary" : "ghost"}
                        className="justify-start gap-2 whitespace-nowrap"
                        onClick={() => setActiveSection(item.id)}
                        data-testid={`button-section-${item.id}`}
                      >
                        <item.icon className="w-4 h-4" />
                        {item.label}
                        <ChevronRight className="w-4 h-4 ml-auto hidden md:block" />
                      </Button>
                    ))}
                  </nav>
                </div>

                <Separator orientation="vertical" className="hidden md:block" />
                <Separator className="md:hidden" />

                <ScrollArea className="flex-1 h-[400px] md:h-[500px]">
                  <div className="pr-4 space-y-6">
                    {activeSection === "sajuAnalysis" && (
                      <div className="space-y-4" data-testid="section-sajuAnalysis">
                        <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                          <h3 className="font-semibold text-lg mb-3">사주팔자 (四柱八字)</h3>
                          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{result.sajuAnalysis.fourPillars}</p>
                        </div>
                        
                        <div className="p-4 rounded-lg bg-muted">
                          <h4 className="font-medium mb-3">오행 분석</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{result.sajuAnalysis.elementAnalysis}</p>
                        </div>

                        <div className="p-4 rounded-lg border">
                          <h4 className="font-medium mb-3">학습에 미치는 영향</h4>
                          <p className="text-sm leading-relaxed whitespace-pre-line">{result.sajuAnalysis.learningInfluence}</p>
                        </div>
                      </div>
                    )}

                    {activeSection === "mbtiAnalysis" && (
                      <div className="space-y-4" data-testid="section-mbtiAnalysis">
                        <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                          <h3 className="font-semibold text-lg mb-3">MBTI 유형 특성</h3>
                          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{result.mbtiAnalysis.typeDescription}</p>
                        </div>
                        
                        <div className="p-4 rounded-lg bg-muted">
                          <h4 className="font-medium mb-3">인지 기능 분석</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{result.mbtiAnalysis.cognitiveFunction}</p>
                        </div>

                        <div className="p-4 rounded-lg border">
                          <h4 className="font-medium mb-3">학습 특성</h4>
                          <p className="text-sm leading-relaxed whitespace-pre-line">{result.mbtiAnalysis.learningCharacteristics}</p>
                        </div>
                      </div>
                    )}

                    {activeSection === "learningStyle" && (
                      <div className="space-y-4" data-testid="section-learningStyle">
                        <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                          <h3 className="font-semibold text-lg mb-2">{result.learningStyle.type}</h3>
                          <p className="text-muted-foreground">{result.learningStyle.description}</p>
                        </div>
                        
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <h4 className="font-medium text-sm text-muted-foreground">강점</h4>
                            <ul className="space-y-1">
                              {result.learningStyle.strengths.map((strength, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm">
                                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
                                  {strength}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="space-y-2">
                            <h4 className="font-medium text-sm text-muted-foreground">개선 영역</h4>
                            <ul className="space-y-1">
                              {result.learningStyle.weaknesses.map((weakness, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                                  {weakness}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeSection === "recommendations" && (
                      <div className="space-y-4" data-testid="section-recommendations">
                        <div className="p-4 rounded-lg bg-muted">
                          <h4 className="font-medium mb-2">추천 학습 환경</h4>
                          <p className="text-sm text-muted-foreground">{result.studyRecommendations.environment}</p>
                          {result.studyRecommendations.environmentSajuBasis && (
                            <div className="mt-3 p-3 rounded bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                              <p className="text-xs font-medium text-amber-700 dark:text-amber-400 mb-1">사주 분석 근거</p>
                              <p className="text-xs text-amber-600 dark:text-amber-300">{result.studyRecommendations.environmentSajuBasis}</p>
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="font-medium">추천 학습 방법</h4>
                          <ul className="space-y-2">
                            {result.studyRecommendations.methods.map((method, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm p-3 rounded-lg bg-card border">
                                <span className="font-semibold text-primary">{i + 1}.</span>
                                {method}
                              </li>
                            ))}
                          </ul>
                          {result.studyRecommendations.methodsSajuBasis && (
                            <div className="mt-2 p-3 rounded bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                              <p className="text-xs font-medium text-amber-700 dark:text-amber-400 mb-1">사주 분석 근거</p>
                              <p className="text-xs text-amber-600 dark:text-amber-300">{result.studyRecommendations.methodsSajuBasis}</p>
                            </div>
                          )}
                        </div>

                        <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                          <h4 className="font-medium mb-2">추천 학습 일정</h4>
                          <p className="text-sm">{result.studyRecommendations.schedule}</p>
                          {result.studyRecommendations.scheduleSajuBasis && (
                            <div className="mt-3 p-3 rounded bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                              <p className="text-xs font-medium text-amber-700 dark:text-amber-400 mb-1">사주 분석 근거</p>
                              <p className="text-xs text-amber-600 dark:text-amber-300">{result.studyRecommendations.scheduleSajuBasis}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {activeSection === "tips" && (
                      <div className="space-y-3" data-testid="section-tips">
                        <h4 className="font-medium">맞춤형 학습 조언</h4>
                        {result.personalizedTips.map((tip, i) => (
                          <div key={i} className="flex items-start gap-3 p-4 rounded-lg bg-muted">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                              <Lightbulb className="w-4 h-4 text-primary" />
                            </div>
                            <p className="text-sm">{tip}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        )}

        <footer className="text-center py-8 mt-8">
          <p className="text-xs text-muted-foreground">
            AI 학생학습 스타일 예측기
          </p>
        </footer>
      </div>
    </div>
  );
}
