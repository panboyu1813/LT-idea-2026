/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Cpu,
  Wrench,
  Clock,
  Lightbulb,
  ChevronRight,
  Box,
  Zap,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Volume2,
  Sun
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Types
interface ProjectIdea {
  id: string;
  title: string;
  description: string;
  difficulty: '簡單' | '中等' | '挑戰';
  timeEstimate: string;
  components: string[];
  mechanism: string;
  triggerCondition: string;      // 啟動控制方式（符合第4點）
  stopCondition: string;         // 停止條件
  logic: string;                 // 自動控制流程
  outputFeedback: string;        // 輸出輔助（聲音/燈光/螢幕）
  tips: string;
}

const PROJECTS: ProjectIdea[] = [
  {
    id: 'trash-can',
    title: '槓桿式自動垃圾桶',
    description: '利用槓桿原理，將馬達的小位移轉換為桶蓋的大角度開啟。',
    difficulty: '簡單',
    timeEstimate: '4 小時',
    components: [
      'Arduino Nano ×1',
      '超音波感測器 HC-SR04 ×1（啟動控制）',
      '伺服馬達 SG90 ×1',
      '木製連桿組 (3mm 木板)',
      '活頁鉸鏈 ×2',
      '綠色 LED ×1（輸出指示）'
    ],
    mechanism: '1. 桶身與桶蓋透過活頁聯接，形成旋轉副。\n2. 伺服馬達固定在桶身後方，馬達擺臂連接一根主動桿。\n3. 主動桿另一端與桶蓋上固定的從動桿用螺絲形成轉動副。\n4. 馬達旋轉約 60° 時，透過連桿推動桶蓋開啟約 90°。',
    triggerCondition: '超音波感測器連續兩次偵測到物體距離小於 15cm（防誤觸），裝置始進入動作。',
    stopCondition: '桶蓋開啟後延遲 3 秒，或感測器偵測物體離開超過 20cm 達 1 秒。',
    logic: '待機中 → 觸發條件成立 → 伺服馬達從 0° 轉到 60° 並保持 → 延遲計時開始 → 計時結束或物體離開 → 馬達轉回 0° 關閉桶蓋 → 綠色 LED 亮 2 秒提示完成。',
    outputFeedback: '桶蓋關閉後綠色 LED 點亮 2 秒，表示動作完成。',
    tips: '超音波感測器安裝高度應對準一般人的腰部位置；連桿長度建議先用厚紙板測試，確保桶蓋能完全開啟。'
  },
  {
    id: 'auto-door',
    title: '齒輪齒條自動門',
    description: '將馬達的旋轉運動精準轉換為門板的直線平移。',
    difficulty: '簡單',
    timeEstimate: '4.5 小時',
    components: [
      'Arduino Nano ×1',
      '紅外線感測器 ×1（啟動控制）',
      '伺服馬達 MG995 ×1',
      '木製齒條與齒輪 (雷切或手工鋸)',
      '微動開關 ×2 (左右極限)',
      'U 型滑軌 (木板製作)',
      '蜂鳴器 ×1（輸出提示）'
    ],
    mechanism: '1. 門板底部固定一排等距木塊作為「齒條」。\n2. 馬達軸心安裝圓形木塊切割出齒輪形狀，與齒條嚙合。\n3. 門板置於 U 型滑軌內，兩側留 1mm 間隙。\n4. 馬達正反轉帶動門板左右平移，極限位置由微動開關切斷電源。',
    triggerCondition: '紅外線感測器偵測到人員靠近 (距離 < 50cm)，裝置啟動。',
    stopCondition: '門板觸碰右側極限開關 (開門到位) 或左側極限開關 (關門到位)。',
    logic: '待機中 → 人員靠近 → 馬達正轉帶動門板右移 → 觸碰右側開關停止 → 延遲 5 秒 → 馬達反轉左移 → 觸碰左側開關停止 → 蜂鳴器響一聲提示關門完成。',
    outputFeedback: '關門到位後蜂鳴器發出「嗶」一聲。',
    tips: '齒輪與齒條的齒距必須一致；若使用雷切，可設計模數 2 的齒形；滑軌內可塗蠟減少摩擦。'
  },
  {
    id: 'soap-dispenser',
    title: '凸輪式自動給皂機',
    description: '利用凸輪機構將旋轉運動轉換為往復的下壓動作。',
    difficulty: '中等',
    timeEstimate: '5 小時',
    components: [
      'Arduino Nano ×1',
      '紅外線感測器 ×1（啟動控制）',
      '伺服馬達 SG90 ×1',
      '木製凸輪 (偏心圓或蛋形)',
      '頂桿與彈簧 (回位用)',
      '微動開關 ×1 (原點偵測)',
      '紅色 LED ×1（輸出指示）'
    ],
    mechanism: '1. 製作一個蛋形凸輪 (最大半徑與最小半徑差約 10mm) 安裝於馬達軸。\n2. 頂桿垂直放置，底部與凸輪邊緣接觸，上方對準皂液壓頭。\n3. 凸輪旋轉時，半徑變化推動頂桿上下往復，壓下壓頭。\n4. 彈簧使頂桿始終貼合凸輪。',
    triggerCondition: '紅外線感測器偵測到手部 (距離 < 10cm)，裝置開始動作。',
    stopCondition: '凸輪旋轉一整圈後，由微動開關偵測凸輪上的缺口，停止馬達。',
    logic: '待機中 → 手部觸發 → 馬達啟動帶動凸輪旋轉 → 頂桿下壓一次 → 凸輪缺口觸發微動開關 → 馬達停止 → 紅色 LED 閃爍三次表示出皂完成。',
    outputFeedback: '出皂完成後紅色 LED 閃爍三次。',
    tips: '凸輪輪廓可用砂紙打磨光滑；彈簧張力不宜過大，以免馬達無法轉動。'
  },
  {
    id: 'vending-machine',
    title: '螺旋輸送販賣機',
    description: '利用螺旋機構將旋轉運動轉換為物體的水平位移。',
    difficulty: '中等',
    timeEstimate: '5 小時',
    components: [
      'Arduino Nano ×1',
      '伺服馬達 MG995 ×1',
      '木製螺旋桿 (以圓木棒手工刻出螺旋槽)',
      '光電感測器 ×1 (檢測旋轉原點)',
      '投幣模擬按鈕 ×1（啟動控制）',
      '蜂鳴器 ×1（輸出提示）'
    ],
    mechanism: '1. 製作一根直徑 20mm 的木棒，在上面刻出深度 5mm 的螺旋槽 (導程 50mm)。\n2. 螺旋桿兩端用軸承固定在箱體上。\n3. 商品 (如小包零食) 放置在螺旋槽內。\n4. 馬達帶動螺旋桿旋轉，螺旋面推動商品向前移動。',
    triggerCondition: '投幣按鈕被按下 (或模擬投幣訊號)，裝置開始動作。',
    stopCondition: '螺旋桿旋轉 360° (由光電感測器偵測反光貼紙或遮斷片)。',
    logic: '待機中 → 按鈕按下 → 馬達啟動帶動螺旋桿旋轉 → 商品被推向出口 → 感測器偵測到完成一圈 → 馬達停止 → 蜂鳴器發出「叮」聲提示商品已推出。',
    outputFeedback: '商品推出後蜂鳴器發出「叮」一聲。',
    tips: '螺旋槽需打磨光滑避免商品卡住；出口處可加裝擋板防止商品掉落後續旋轉。'
  },
  {
    id: 'geneva-drive',
    title: '槽輪間歇計分機',
    description: '利用槽輪機構實現精準的間歇性轉動，確保計分盤精準對齊。',
    difficulty: '中等',
    timeEstimate: '6 小時',
    components: [
      'Arduino Nano ×1',
      '伺服馬達 MG995 ×1',
      '木製槽輪 (4槽) 與撥桿盤',
      '紅外線偵測器 ×1（進球感應，啟動控制）',
      '計分盤 (圓盤貼數字)',
      '綠色 LED ×1（輸出指示）'
    ],
    mechanism: '1. 製作一個帶有四個徑向槽的「槽輪」，與計分盤同軸固定。\n2. 製作一個「撥桿盤」，其上有一圓柱銷。\n3. 撥桿盤旋轉一圈，圓柱銷進入槽內帶動槽輪轉動 90° 後脫離，槽輪被弧面鎖定。\n4. 每進一球，撥桿盤轉一圈，計分盤前進一格。',
    triggerCondition: '球體經過籃框下方的紅外線偵測器，裝置啟動計分。',
    stopCondition: '撥桿盤上的遮光片觸發光電感測器 (表示完成一圈)。',
    logic: '待機中 → 偵測到進球 → 馬達啟動帶動撥桿盤旋轉 → 圓柱銷帶動槽輪轉 90° → 感測器偵測撥桿盤原點 → 馬達停止 → 綠色 LED 閃爍一次表示計分成功。',
    outputFeedback: '每計一分，綠色 LED 閃爍一次。',
    tips: '槽輪與撥桿盤的間隙要小，以免晃動；可將計分盤改為獎品轉盤，增加趣味。'
  },
  {
    id: 'cam-vibrator',
    title: '凸輪式震動篩選機',
    description: '利用凸輪機構使篩網產生往復震動，用於分離大小不同的物體。',
    difficulty: '中等',
    timeEstimate: '5 小時',
    components: [
      'Arduino Nano ×1',
      '直流馬達 (附偏心塊或凸輪) ×1',
      '木製篩網框架與篩網',
      '彈簧 ×4 (懸掛框架用)',
      '紅外線計數感測器 ×1（啟動控制）',
      '綠色 LED ×1（輸出指示）'
    ],
    mechanism: '1. 篩網框架四角用彈簧懸掛在固定支架上。\n2. 馬達軸安裝一個凸輪 (或偏心塊)，抵住框架底部。\n3. 馬達旋轉時，凸輪週期性頂起框架，彈簧使框架回位，產生震動。\n4. 調整馬達轉速可改變震動頻率。',
    triggerCondition: '按下啟動按鈕，或紅外線感測器偵測到有物體進入篩網，裝置開始震動。',
    stopCondition: '定時 30 秒後停止，或按下停止按鈕。',
    logic: '待機中 → 啟動後馬達以固定轉速旋轉，帶動篩網震動 → 時間到或手動停止則關閉馬達 → 震動期間綠色 LED 恆亮，停止後熄滅。',
    outputFeedback: '震動時綠色 LED 恆亮，停止時熄滅。',
    tips: '凸輪升程不宜過大，以免框架撞擊；彈簧選擇軟硬度適中的，確保震動順暢。'
  },
  {
    id: 'crank-rocker-fan',
    title: '曲柄搖桿式風扇擺頭機構',
    description: '模擬電風扇擺頭，利用曲柄搖桿機構使風扇往復擺動。',
    difficulty: '中等',
    timeEstimate: '5 小時',
    components: [
      'Arduino Nano ×1',
      '直流馬達 (減速) ×1',
      '木製曲柄、連桿、搖桿',
      '風扇葉片 (可用 CD 片製作)',
      '紅外線遙控接收器 ×1（啟動控制）',
      '藍色 LED ×1（輸出指示）'
    ],
    mechanism: '1. 曲柄固定在馬達軸上，長度約 30mm。\n2. 連桿連接曲柄與搖桿，搖桿另一端固定風扇頭。\n3. 馬達持續旋轉時，曲柄帶動連桿，使搖桿往復擺動 (擺角約 60°)。\n4. 風扇頭安裝在搖桿上，即可實現擺頭。',
    triggerCondition: '按下遙控器上的啟動按鈕（紅外線訊號），裝置開始運作。',
    stopCondition: '再次按下遙控器上的停止按鈕。',
    logic: '待機中 → 收到啟動訊號 → 馬達持續旋轉，帶動曲柄搖桿機構，使風扇來回擺動 → 藍色 LED 恆亮 → 收到停止訊號 → 馬達斷電，LED 熄滅。',
    outputFeedback: '運作時藍色 LED 恆亮，停止時熄滅。',
    tips: '曲柄長度決定擺角，可透過更換不同長度的曲柄調整；連桿與搖桿連接處需順暢，避免卡死。'
  },
  {
    id: 'ratchet-index',
    title: '棘輪式單向間歇傳動',
    description: '利用棘輪機構實現單向間歇運動，可用於計數或送料。',
    difficulty: '中等',
    timeEstimate: '5 小時',
    components: [
      'Arduino Nano ×1',
      '伺服馬達 SG90 ×1',
      '木製棘輪與棘爪',
      '推送桿 (連接棘輪)',
      '微動開關 ×1 (原點偵測)',
      '紅外線感測器 ×1（啟動控制）',
      '紅色 LED ×1（輸出指示）'
    ],
    mechanism: '1. 棘輪固定在轉軸上，與推送桿相連。\n2. 棘爪由伺服馬達帶動，馬達每動作一次，棘爪推動棘輪前進一齒，並被止回棘爪卡住防止逆轉。\n3. 推送桿隨棘輪轉動，將前方物體往前推送一格。\n4. 適用於步進送料、自動計數等。',
    triggerCondition: '紅外線感測器偵測到物體接近（或定時脈衝），裝置開始一次推送。',
    stopCondition: '推送到位 (由微動開關偵測推送桿位置) 或完成預設次數。',
    logic: '待機中 → 每次觸發 → 伺服馬達帶動棘爪推動棘輪轉一齒 → 微動開關確認位置 → 紅色 LED 閃爍一次表示推送完成 → 等待下次觸發。',
    outputFeedback: '每推送一次，紅色 LED 閃爍一次。',
    tips: '棘輪齒形需對稱，棘爪角度約 70° 較易嚙合；可用彈簧使棘爪始終接觸棘輪。'
  },
  {
    id: 'elevator',
    title: '五層樓智慧電梯系統',
    description: '模擬真實電梯邏輯，具備步進馬達精準定位、曲柄連桿自動門與紅外線防夾安全機制。',
    difficulty: '挑戰',
    timeEstimate: '6 小時+',
    components: [
      'Arduino Nano ×1',
      '28BYJ-48 步進馬達 + ULN2003 驅動板 ×1 (升降定位)',
      'SG90 伺服馬達 ×1 (自動門機構)',
      '紅外線避障感測器 ×1 (門口防夾安全)',
      'I2C LCD 1602 模組 ×1 (樓層與狀態顯示)',
      '微動按鈕 ×10 (內外樓層呼叫)',
      '微動開關 ×1 (1F 歸零校準 Homing)',
      '主動式蜂鳴器 ×1 (到達提示音)',
      '2020 鋁擠型或壓克力板 (主框架)'
    ],
    mechanism: '1. 升降系統：採用「捲揚式滑輪組」，步進馬達軸心安裝捲線盤，透過繩索帶動車廂沿垂直導軌升降。利用步進馬達的脈波計數實現 0.1mm 等級的精準數位定位。\n2. 自動門系統：採用「曲柄連桿機構 (Crank-Linkage)」，將伺服馬達的旋轉運動轉化為門板的直線平移，運動曲線接近正弦波，實現緩啟緩停的優雅動作。\n3. 穩定優化：底層安裝微動開關作為絕對零點 (Homing)；建議增加配重塊 (Counterweight) 以平衡車廂重量，降低馬達功耗並增加運行穩定度。',
    triggerCondition: '按下外部呼叫鈕或內部選樓鈕（系統具備智慧調度邏輯，依順向優先原則排序）。',
    stopCondition: '步進馬達達到目標樓層預設脈波數，或觸發 1F 歸零開關。',
    logic: '系統採用狀態機架構：\n1. IDLE (待機)：門關閉，等待呼叫。\n2. MOVING (移動)：步進馬達精準位移，LCD 顯示方向。\n3. ARRIVED (到達)：蜂鳴器響，LCD 顯示 Arrived。\n4. DOOR_OPEN (開門)：伺服馬達轉動 90° 帶動連桿。\n5. DOOR_CLOSE (關門)：執行關門，若紅外線偵測障礙則立即重開。',
    outputFeedback: 'LCD 1602 即時顯示樓層與移動方向；到達時蜂鳴器提示；抵達目標樓層時對應 LED 亮起。',
    tips: '步進馬達定位需配合 1F 歸零校準以消除累積誤差；連桿機構的活動軸需確保順暢；車廂導靴與導軌間隙應微調至不晃動且不卡死。建議使用 2020 鋁擠型條提供高剛性支撐。'
  },
  {
    id: 'pantograph',
    title: '平行連桿繪圖機',
    description: '利用平行四邊形連桿機構，實現幾何圖形的等比例縮放或傳遞。',
    difficulty: '挑戰',
    timeEstimate: '6 小時+',
    components: [
      'Arduino Nano ×1',
      '伺服馬達 SG90 ×2',
      '木製平行連桿組 (四根等長木條)',
      '啟動按鈕 ×1（啟動控制）',
      '筆夾與繪圖筆',
      '藍色 LED ×1（輸出指示）'
    ],
    mechanism: '1. 使用四根木條透過活動軸連接成平行四邊形，其中一個頂點固定作為支點。\n2. 在兩個相鄰的自由端分別連接兩個伺服馬達。\n3. 對角的頂點安裝筆夾。\n4. 透過控制兩馬達的角度，可讓筆端畫出縮放後的軌跡。',
    triggerCondition: '按下啟動按鈕，裝置開始繪製預設圖形。',
    stopCondition: '完成預設的路徑點數 (例如畫一個正方形) 後自動停止。',
    logic: '待機中 → 按鈕按下 → Arduino 依序輸出預先計算好的角度給兩個馬達，帶動連桿運動，使筆端畫出圖形 → 完成後馬達歸零 → 藍色 LED 恆亮 3 秒提示繪圖完成。',
    outputFeedback: '繪圖完成後藍色 LED 恆亮 3 秒。',
    tips: '連桿長度需精確相等，否則軌跡會變形；可先用程式模擬軌跡，再轉換為馬達角度。'
  },
  {
    id: 'claw-machine',
    title: '自動夾取裝置 (連桿夾爪)',
    description: '按下按鈕後，機械臂自動移動至指定位置抓取物品並返回，結合滑台與連桿夾爪。',
    difficulty: '挑戰',
    timeEstimate: '6 小時+',
    components: [
      'Arduino Nano ×1',
      '伺服馬達 MG995 ×3 (X軸、Y軸、夾爪)',
      '木製滑軌與螺桿傳動 (X-Y平台)',
      '連桿夾爪 (三片式)',
      '啟動按鈕 ×1（啟動控制）',
      '極限開關 ×4 (平台邊界)',
      '蜂鳴器 ×1（輸出提示）'
    ],
    mechanism: '1. X-Y平台：兩個垂直方向的滑台，使用皮帶或螺桿傳動。\n2. 夾爪：三片木板透過活動軸形成對稱連桿，中央馬達拉動連桿使兩側夾片同步閉合。\n3. 夾爪固定在 Y 軸滑台上。\n4. 透過極限開關定位原點與抓取點。',
    triggerCondition: '按下啟動按鈕，裝置開始執行自動抓取流程。',
    stopCondition: '完成一次抓取並返回原點後自動停止。',
    logic: '待機中 → 按鈕按下 → X軸移動至抓取點（由預設座標決定）→ Y軸移動至抓取點 → 夾爪閉合抓取 → 延遲 1 秒 → X軸返回原點 → Y軸返回原點 → 夾爪放開 → 蜂鳴器響三聲提示完成。',
    outputFeedback: '抓取完成後蜂鳴器響三聲。',
    tips: '夾爪的閉合力道可透過調整連桿長度改變；滑台需確保平行，避免卡死；抓取點可透過修改程式調整。'
  },
  {
    id: 'geared-turret',
    title: '齒輪傳動自動炮塔',
    description: '透過齒輪組減速增扭，實現炮台的高精度俯仰與旋轉，並自動追蹤目標。',
    difficulty: '挑戰',
    timeEstimate: '6 小時+',
    components: [
      'Arduino Nano ×1',
      '超音波感測器 HC-SR04 ×1（啟動控制）',
      '伺服馬達 MG996R ×2',
      '木製齒輪組 (減速比 3:1)',
      '炮管 (吸管或木棒)',
      '紅色 LED ×1（輸出指示）'
    ],
    mechanism: '1. 旋轉底座：大齒輪固定於底座，小齒輪裝在馬達上，馬達轉動帶動整個上盤旋轉。\n2. 俯仰機構：炮管與扇形齒輪固定，另一個小馬達帶動小齒輪驅動扇形齒輪，實現俯仰。\n3. 超音波感測器安裝在炮塔上，隨炮塔轉動掃描。',
    triggerCondition: '超音波感測器在掃描範圍內偵測到物體 (距離 < 50cm)，裝置開始追蹤。',
    stopCondition: '目標消失 (連續 2 秒未測到) 或按下停止按鈕。',
    logic: '待機中持續左右掃描 → 一旦偵測到目標，即鎖定目標角度，並啟動追蹤演算法 (PID) 使炮管對準目標 → 目標消失則停止追蹤 → 追蹤期間紅色 LED 恆亮。',
    outputFeedback: '追蹤目標時紅色 LED 恆亮，目標消失後熄滅。',
    tips: '齒輪間隙會影響精度，可在程式加入微調；若使用連續旋轉馬達，需搭配編碼器或光電開關定位。'
  },
  {
    id: 'walking-linkage',
    title: '仿生連桿行走機構',
    description: '利用切比雪夫連桿機構，將單一旋轉運動轉換為複雜的足部行走軌跡。',
    difficulty: '挑戰',
    timeEstimate: '6 小時+',
    components: [
      'Arduino Nano ×1',
      '直流減速馬達 (附編碼器) ×1',
      '木製多連桿組 (切比雪夫連桿)',
      'L298N 馬達驅動板 ×1',
      '超音波感測器 ×1（啟動控制 / 避障）',
      '蜂鳴器 ×1（輸出提示）'
    ],
    mechanism: '1. 每條腿由四根木條組成連桿，比例為固定 (如曲柄:連桿:搖桿 = 1:2.5:2.5)。\n2. 左右腿相位差 180°，由同一馬達驅動曲柄。\n3. 馬達旋轉時，足部末端畫出「D」字形軌跡，實現抬腿、前進、支撐。\n4. 機構裝上底板，重心配置得當即可行走。',
    triggerCondition: '切換至自動模式 (或按下前進按鈕)，裝置開始行走。',
    stopCondition: '超音波感測器偵測到前方障礙物 < 20cm，或切換至停止模式。',
    logic: '待機中 → 啟動後馬達持續運轉，機構帶動腿部行走 → 若前方障礙物太近，馬達停止 → 蜂鳴器發出警告聲 → 按下停止按鈕立即停止。',
    outputFeedback: '遇到障礙停止時蜂鳴器發出警告聲。',
    tips: '連桿比例需精確，可先用線圖軟體模擬軌跡；足部可加橡膠套增加摩擦力。'
  },
  {
    id: 'fourbar-wing',
    title: '自動仿生翅膀拍動',
    description: '利用雙搖桿機構模擬鳥類翅膀的拍動，按下按鈕後自動拍動數次。',
    difficulty: '挑戰',
    timeEstimate: '6 小時+',
    components: [
      'Arduino Nano ×1',
      '伺服馬達 MG995 ×2 (左右各一)',
      '木製連桿組 (雙搖桿)',
      '薄布或紙張作為翼膜',
      '啟動按鈕 ×1（啟動控制）',
      '藍色 LED ×1（輸出指示）'
    ],
    mechanism: '1. 左右翅膀各由一組雙搖桿機構構成：一個主動搖桿由馬達帶動，通過連桿帶動從動搖桿。\n2. 兩組機構對稱安裝，可獨立控制或同步。\n3. 馬達擺動時，搖桿帶動翅膀骨架上下拍動，翼膜產生升力。\n4. 可透過改變連桿長度調整拍動幅度。',
    triggerCondition: '按下啟動按鈕，裝置開始自動拍動。',
    stopCondition: '完成預設拍動次數（如 10 次）後自動停止。',
    logic: '待機中 → 按鈕按下 → 左右馬達同步擺動，帶動翅膀拍動 10 次 → 馬達歸零 → 藍色 LED 閃爍 5 次提示完成。',
    outputFeedback: '拍動完成後藍色 LED 閃爍 5 次。',
    tips: '連桿連接處需使用軸承或墊片減少摩擦；翼膜需繃緊但留有一定彈性。'
  }
];

export default function App() {
  const [selectedProject, setSelectedProject] = useState<ProjectIdea | null>(null);

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans selection:bg-emerald-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 p-2 rounded-lg">
              <Cpu className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">高中生機電整合實作指南</h1>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-sm font-medium text-gray-500">
            <span className="flex items-center gap-1.5"><Clock size={16} /> 6 小時限定</span>
            <span className="flex items-center gap-1.5"><Box size={16} /> 木板機構</span>
            <span className="flex items-center gap-1.5"><Zap size={16} /> Arduino Nano</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Intro Section */}
        <section className="mb-16">
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-8 flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-4 text-emerald-900">如何在 6 小時內完成？</h2>
              <p className="text-emerald-800/80 leading-relaxed mb-6">
                針對高中生設計的實作流程：2 小時機構製作、2 小時電路連接、2 小時程式調試。
                選擇一個感興趣的主題，我們為你準備了完整的零件清單與電控邏輯說明。
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-emerald-700 font-medium">
                  <CheckCircle2 size={18} /> 結構簡單化
                </div>
                <div className="flex items-center gap-2 text-emerald-700 font-medium">
                  <CheckCircle2 size={18} /> 模組化電路
                </div>
                <div className="flex items-center gap-2 text-emerald-700 font-medium">
                  <CheckCircle2 size={18} /> 程式邏輯清晰
                </div>
                <div className="flex items-center gap-2 text-emerald-700 font-medium">
                  <CheckCircle2 size={18} /> 容易取得材料
                </div>
              </div>
            </div>
            <div className="w-full md:w-64 aspect-square bg-white rounded-xl shadow-sm border border-emerald-100 p-6 flex flex-col justify-center items-center text-center">
              <Wrench className="w-12 h-12 text-emerald-500 mb-4" />
              <span className="text-sm font-semibold text-emerald-900 uppercase tracking-wider">實作重點</span>
              <p className="text-xs text-emerald-700 mt-2">優先確保機構穩定，再進行電路配線。</p>
            </div>
          </div>
        </section>

        {/* Project Selection */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <Lightbulb className="text-amber-500" /> 推薦專案主題
            </h3>
            <span className="text-sm text-gray-400">共 {PROJECTS.length} 個案例</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PROJECTS.map((project) => (
              <motion.button
                key={project.id}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedProject(project)}
                className={`text-left p-6 rounded-2xl border transition-all duration-200 ${
                  selectedProject?.id === project.id 
                  ? 'bg-white border-emerald-500 shadow-lg shadow-emerald-500/10 ring-2 ring-emerald-500/20' 
                  : 'bg-white border-gray-200 hover:border-emerald-300 hover:shadow-md'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    project.difficulty === '簡單' ? 'bg-blue-50 text-blue-600' : 
                    project.difficulty === '中等' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                  }`}>
                    {project.difficulty}
                  </span>
                  <span className="text-xs text-gray-400 font-medium">{project.timeEstimate}</span>
                </div>
                <h4 className="text-lg font-bold mb-2">{project.title}</h4>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4">{project.description}</p>
                <div className="flex items-center text-emerald-600 text-sm font-semibold">
                  查看詳情 <ChevronRight size={16} />
                </div>
              </motion.button>
            ))}
          </div>
        </section>

        {/* Project Details */}
        <AnimatePresence mode="wait">
          {selectedProject ? (
            <motion.section
              key={selectedProject.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm"
            >
              <div className="bg-gray-900 p-8 text-white">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="text-3xl font-bold mb-2">{selectedProject.title}</h3>
                    <p className="text-gray-400 max-w-2xl">{selectedProject.description}</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm">
                      <span className="block text-[10px] text-gray-400 uppercase font-bold">預估時間</span>
                      <span className="font-semibold">{selectedProject.timeEstimate}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left Column: Parts, Control Logic, Output Feedback */}
                <div className="space-y-8">
                  <div>
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Box size={16} /> 零件清單
                    </h4>
                    <ul className="grid grid-cols-1 gap-3">
                      {selectedProject.components.map((comp, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm bg-gray-50 p-3 rounded-xl border border-gray-100">
                          <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                          <span>{comp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Zap size={16} /> 電控邏輯 (Trigger & Stop)
                    </h4>
                    <div className="space-y-4">
                      <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
                        <span className="block text-[10px] text-blue-600 uppercase font-bold mb-1">觸發條件 (Trigger)</span>
                        <p className="text-sm text-blue-900">{selectedProject.triggerCondition}</p>
                      </div>
                      <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl">
                        <span className="block text-[10px] text-rose-600 uppercase font-bold mb-1">停止條件 (Stop)</span>
                        <p className="text-sm text-rose-900">{selectedProject.stopCondition}</p>
                      </div>
                      <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl">
                        <span className="block text-[10px] text-gray-600 uppercase font-bold mb-1">運作流程</span>
                        <p className="text-sm text-gray-900 leading-relaxed">{selectedProject.logic}</p>
                      </div>
                    </div>
                  </div>

                  {/* 輸出反饋區塊 */}
                  <div>
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Volume2 size={16} className="text-purple-500" /> 輸出反饋 (聲音/燈光/螢幕)
                    </h4>
                    <div className="bg-purple-50 border border-purple-100 p-4 rounded-xl">
                      <p className="text-sm text-purple-900">{selectedProject.outputFeedback}</p>
                    </div>
                  </div>
                </div>

                {/* Right Column: Mechanism & Tips */}
                <div className="space-y-8">
                  <div>
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Wrench size={16} /> 機構製作重點
                    </h4>
                    <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl text-sm text-amber-900 leading-relaxed whitespace-pre-line shadow-sm">
                      {selectedProject.mechanism}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <AlertCircle size={16} /> 實作技巧
                    </h4>
                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                      <p className="text-sm text-gray-700 leading-relaxed">{selectedProject.tips}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-3xl text-gray-400">
              <ArrowRight className="animate-bounce mb-2" />
              <p>請從上方選擇一個專案來查看詳細指南</p>
            </div>
          )}
        </AnimatePresence>

        {/* Timeline Tips */}
        <section className="mt-20">
          <h3 className="text-2xl font-bold mb-8 text-center">6 小時實作時間分配建議</h3>
          <div className="relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 hidden md:block" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {[
                { time: '0-2h', title: '機構製作', desc: '木板切割、黏合、轉軸安裝。確保結構穩固。' },
                { time: '2-4h', title: '電路配線', desc: '感測器與馬達接線，使用麵包板或焊接。' },
                { time: '4-6h', title: '程式調試', desc: '上傳程式，調整感測距離與馬達角度。' }
              ].map((step, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-gray-200 relative z-1">
                  <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold mb-4 mx-auto md:mx-0">
                    {i + 1}
                  </div>
                  <span className="text-emerald-600 font-bold text-sm">{step.time}</span>
                  <h5 className="font-bold text-lg mb-2">{step.title}</h5>
                  <p className="text-sm text-gray-500">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 mt-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 機公整人實作教學資源庫 | 專為科學實中設計
          </p>
        </div>
      </footer>
    </div>
  );
}