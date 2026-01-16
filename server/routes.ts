import type { Express } from "express";
import { createServer, type Server } from "http";
import { predictionRequestSchema, type PredictionResult } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.post("/api/predict", async (req, res) => {
    try {
      const validationResult = predictionRequestSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "입력 데이터가 올바르지 않습니다.",
          details: validationResult.error.errors 
        });
      }

      const data = validationResult.data;
      const apiKey = process.env.OPENAI_API_KEY;

      if (!apiKey) {
        return res.status(500).json({ error: "OpenAI API 키가 설정되지 않았습니다." });
      }

      const calendarTypeText = data.calendarType === "lunar" ? "음력" : "양력";
      const birthTime = `${calendarTypeText} ${data.birthYear}년 ${data.birthMonth}월 ${data.birthDay}일 ${data.birthPeriod === "AM" ? "오전" : "오후"} ${data.birthHour}시`;
      
      const systemPrompt = `당신은 사주명리학과 MBTI 심리학을 결합하여 학생의 학습 스타일을 분석하는 전문 AI입니다.

## 분석 지침
1. **사주 분석 (최우선)**: 생년월일시를 바탕으로 사주팔자(년주, 월주, 일주, 시주)를 계산하고, 오행(목, 화, 토, 금, 수)의 분포와 균형을 분석하세요. **중요**: 음력으로 입력된 경우 음력 날짜를 기준으로 사주를 계산하세요.
2. **MBTI 분석**: 해당 MBTI 유형의 인지 기능(주기능, 부기능, 3차기능, 열등기능)을 분석하세요.
3. **학습 추천 (사주 기반 필수)**: 학습 환경, 방법, 일정 추천 시 반드시 사주의 오행과 시주를 근거로 설명하세요. 예: "화(火)가 강해 오후 시간대 집중력 상승", "수(水)가 부족해 조용한 환경 필요" 등.

반드시 다음 JSON 형식으로만 응답하세요. JSON 외의 다른 텍스트는 절대 포함하지 마세요:
{
  "sajuAnalysis": {
    "fourPillars": "사주팔자 상세 설명 (년주, 월주, 일주, 시주와 각각의 천간지지 설명, 최소 4-5문장)",
    "elementAnalysis": "오행 분포 분석 (목, 화, 토, 금, 수 각각의 강약과 의미, 최소 4-5문장)",
    "learningInfluence": "사주가 학습에 미치는 영향 상세 분석 (최소 4-5문장)"
  },
  "mbtiAnalysis": {
    "typeDescription": "MBTI 유형의 핵심 특성 설명 (최소 3-4문장)",
    "cognitiveFunction": "인지 기능 스택 분석 (주기능, 부기능, 3차기능, 열등기능 각각 설명, 최소 4-5문장)",
    "learningCharacteristics": "MBTI 기반 학습 특성 상세 분석 (최소 4-5문장)"
  },
  "learningStyle": {
    "type": "학습 스타일 유형명 (사주와 MBTI를 종합한 고유한 유형명)",
    "description": "학습 스타일 상세 설명 (사주와 MBTI를 어떻게 결합했는지 포함, 최소 4-5문장)",
    "strengths": ["구체적인 강점1 (2문장 이상)", "구체적인 강점2 (2문장 이상)", "구체적인 강점3 (2문장 이상)", "구체적인 강점4 (2문장 이상)"],
    "weaknesses": ["구체적인 개선점1 (2문장 이상)", "구체적인 개선점2 (2문장 이상)", "구체적인 개선점3 (2문장 이상)", "구체적인 개선점4 (2문장 이상)"]
  },
  "studyRecommendations": {
    "environment": "추천 학습 환경 상세 설명 (사주 오행 특성을 근거로 구체적인 환경 추천, 최소 3-4문장)",
    "environmentSajuBasis": "학습 환경 추천의 사주 근거 (어떤 오행 특성이 이 환경을 추천하게 했는지, 최소 2-3문장)",
    "methods": ["구체적인 학습 방법1 (2문장 이상)", "구체적인 학습 방법2 (2문장 이상)", "구체적인 학습 방법3 (2문장 이상)", "구체적인 학습 방법4 (2문장 이상)", "구체적인 학습 방법5 (2문장 이상)"],
    "methodsSajuBasis": "학습 방법 추천의 사주 근거 (오행 분포가 학습 방법 선택에 어떤 영향을 미쳤는지, 최소 2-3문장)",
    "schedule": "추천 학습 일정 및 시간대 (사주의 시주와 오행 에너지 패턴 기반, 최소 3-4문장)",
    "scheduleSajuBasis": "학습 일정 추천의 사주 근거 (시주와 오행이 시간대 선택에 미친 영향, 최소 2-3문장)"
  },
  "personalizedTips": ["상세한 맞춤 조언1 (3문장 이상)", "상세한 맞춤 조언2 (3문장 이상)", "상세한 맞춤 조언3 (3문장 이상)", "상세한 맞춤 조언4 (3문장 이상)", "상세한 맞춤 조언5 (3문장 이상)", "상세한 맞춤 조언6 (3문장 이상)"]
}`;

      const genderText = data.gender === "male" ? "남자" : "여자";
      
      const userPrompt = `다음 학생의 정보를 바탕으로 사주와 MBTI를 깊이 있게 분석하고, 학습 스타일을 상세히 분석해주세요:

이름: ${data.name}
성별: ${genderText}
사주 (생년월일시): ${birthTime}
역법: ${calendarTypeText} (${data.calendarType === "lunar" ? "음력 날짜 기준으로 사주팔자 계산 필요" : "양력 날짜 기준"})
MBTI: ${data.mbti}

중요 사항:
1. 사주팔자를 정확하게 계산하고 각 기둥(년주, 월주, 일주, 시주)의 의미를 설명해주세요. 성별(${genderText})에 따른 대운과 학습 성향의 차이도 고려하세요.
2. 오행의 분포와 균형을 분석하고 이것이 학습에 미치는 영향을 구체적으로 설명해주세요.
3. MBTI의 인지 기능 스택을 분석하고 학습 방식과의 연관성을 설명해주세요.
4. 모든 분석은 최대한 상세하고 구체적으로 작성해주세요.`;

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          max_tokens: 4000,
          response_format: { type: "json_object" }
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("OpenAI API Error:", errorData);
        return res.status(500).json({ 
          error: "AI 분석 중 오류가 발생했습니다.",
          details: errorData
        });
      }

      const apiResponse = await response.json();
      
      let analysisText = "";
      if (apiResponse.choices && apiResponse.choices[0] && apiResponse.choices[0].message) {
        analysisText = apiResponse.choices[0].message.content;
      }

      if (!analysisText) {
        console.error("Unexpected API response structure:", JSON.stringify(apiResponse));
        return res.status(500).json({ 
          error: "AI 응답을 파싱할 수 없습니다.",
          details: apiResponse
        });
      }

      let analysisData;
      try {
        analysisData = JSON.parse(analysisText);
        
        if (!analysisData.learningStyle || !analysisData.studyRecommendations || 
            !analysisData.personalizedTips ||
            !analysisData.sajuAnalysis || !analysisData.mbtiAnalysis) {
          throw new Error("Missing required fields in response");
        }
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
        console.error("Raw response:", analysisText);
        return res.status(500).json({ 
          error: "AI 응답 JSON 파싱 실패",
          rawResponse: analysisText
        });
      }

      const result: PredictionResult = {
        studentName: data.name,
        sajuAnalysis: analysisData.sajuAnalysis,
        mbtiAnalysis: analysisData.mbtiAnalysis,
        learningStyle: analysisData.learningStyle,
        studyRecommendations: analysisData.studyRecommendations,
        personalizedTips: analysisData.personalizedTips,
        timestamp: new Date().toISOString()
      };

      res.json(result);
    } catch (error) {
      console.error("Prediction Error:", error);
      res.status(500).json({ 
        error: "예측 분석 중 오류가 발생했습니다.",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  return httpServer;
}
