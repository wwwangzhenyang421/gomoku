// 五子棋AI算法
// 使用评估函数和搜索算法来选择最佳落子位置

const BOARD_SIZE = 15;

// 棋型评估分数
const PATTERNS = {
  // 己方棋型（白子）
  FIVE: 100000,           // 五连
  LIVE_FOUR: 10000,       // 活四
  RUSH_FOUR: 1000,        // 冲四
  LIVE_THREE: 1000,       // 活三
  SLEEP_THREE: 100,       // 眠三
  LIVE_TWO: 100,          // 活二
  SLEEP_TWO: 10,          // 眠二
  // 对方棋型（黑子）- 需要防守（提高防守权重！）
  OPPONENT_FIVE: -200000,        // 对方五连（必须堵）
  OPPONENT_LIVE_FOUR: -50000,    // 对方活四（必须堵，否则必输）
  OPPONENT_RUSH_FOUR: -10000,    // 对方冲四（必须堵）
  OPPONENT_LIVE_THREE: -2000,    // 对方活三（重要防守）
  OPPONENT_SLEEP_THREE: -200,    // 对方眠三
  OPPONENT_LIVE_TWO: -100,       // 对方活二
  OPPONENT_SLEEP_TWO: -10,       // 对方眠二
};

// 检查棋型
function checkPattern(board, row, col, player, directions) {
  const patterns = {
    five: 0,
    liveFour: 0,
    rushFour: 0,
    liveThree: 0,
    sleepThree: 0,
    liveTwo: 0,
    sleepTwo: 0,
  };

  for (const [dx, dy] of directions) {
    let count = 1; // 当前棋子
    let blockedLeft = false;
    let blockedRight = false;

    // 向一个方向检查
    let r = row + dx;
    let c = col + dy;
    while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
      count++;
      r += dx;
      c += dy;
    }
    if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE || board[r][c] !== 0) {
      blockedRight = true;
    }

    // 向另一个方向检查
    r = row - dx;
    c = col - dy;
    while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
      count++;
      r -= dx;
      c -= dy;
    }
    if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE || board[r][c] !== 0) {
      blockedLeft = true;
    }

    // 判断棋型
    if (count >= 5) {
      patterns.five++;
    } else if (count === 4) {
      if (!blockedLeft && !blockedRight) {
        patterns.liveFour++;
      } else if (!blockedLeft || !blockedRight) {
        patterns.rushFour++;
      }
    } else if (count === 3) {
      if (!blockedLeft && !blockedRight) {
        patterns.liveThree++;
      } else if (!blockedLeft || !blockedRight) {
        patterns.sleepThree++;
      }
    } else if (count === 2) {
      if (!blockedLeft && !blockedRight) {
        patterns.liveTwo++;
      } else if (!blockedLeft || !blockedRight) {
        patterns.sleepTwo++;
      }
    }
  }

  return patterns;
}

// 检查对方在某个位置的威胁（不放置棋子，直接检查）
function checkOpponentThreat(board, row, col, opponentPlayer) {
  if (board[row][col] !== 0) return null;

  const directions = [
    [0, 1],   // 横向
    [1, 0],   // 纵向
    [1, 1],   // 主对角线
    [1, -1],  // 副对角线
  ];

  const threats = {
    five: 0,
    liveFour: 0,
    rushFour: 0,
    liveThree: 0,
  };

  for (const [dx, dy] of directions) {
    // 检查这个方向上的连续棋子
    let count = 0;
    let blockedLeft = false;
    let blockedRight = false;
    let hasSpace = false;

    // 向前检查
    let r = row + dx;
    let c = col + dy;
    while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === opponentPlayer) {
      count++;
      r += dx;
      c += dy;
    }
    if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === 0) {
      hasSpace = true;
    } else {
      blockedRight = true;
    }

    // 向后检查
    r = row - dx;
    c = col - dy;
    while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === opponentPlayer) {
      count++;
      r -= dx;
      c -= dy;
    }
    if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === 0) {
      hasSpace = true;
    } else {
      blockedLeft = true;
    }

    // 判断威胁类型
    if (count >= 4) {
      if (!blockedLeft && !blockedRight) {
        threats.liveFour++;
      } else if ((!blockedLeft || !blockedRight) && hasSpace) {
        threats.rushFour++;
      }
    } else if (count === 3) {
      if (!blockedLeft && !blockedRight) {
        threats.liveThree++;
      }
    }
  }

  return threats;
}

// 评估一个位置的分数
function evaluatePosition(board, row, col, player) {
  if (board[row][col] !== 0) return -Infinity;

  const directions = [
    [0, 1],   // 横向
    [1, 0],   // 纵向
    [1, 1],   // 主对角线
    [1, -1],  // 副对角线
  ];

  // 创建棋盘副本进行评估，避免修改原始棋盘
  const boardCopy = board.map(r => [...r]);
  
  // 临时放置棋子进行评估
  boardCopy[row][col] = player;
  const myPatterns = checkPattern(boardCopy, row, col, player, directions);

  // 检查对方的威胁（在当前位置）
  const opponentPlayer = -player;
  const opponentThreats = checkOpponentThreat(board, row, col, opponentPlayer);

  let score = 0;

  // 己方得分
  score += myPatterns.five * PATTERNS.FIVE;
  score += myPatterns.liveFour * PATTERNS.LIVE_FOUR;
  score += myPatterns.rushFour * PATTERNS.RUSH_FOUR;
  score += myPatterns.liveThree * PATTERNS.LIVE_THREE;
  score += myPatterns.sleepThree * PATTERNS.SLEEP_THREE;
  score += myPatterns.liveTwo * PATTERNS.LIVE_TWO;
  score += myPatterns.sleepTwo * PATTERNS.SLEEP_TWO;

  // 对方威胁（防守）- 使用检查到的实际威胁
  if (opponentThreats) {
    score += opponentThreats.five * PATTERNS.OPPONENT_FIVE;
    score += opponentThreats.liveFour * PATTERNS.OPPONENT_LIVE_FOUR;
    score += opponentThreats.rushFour * PATTERNS.OPPONENT_RUSH_FOUR;
    score += opponentThreats.liveThree * PATTERNS.OPPONENT_LIVE_THREE;
  }

  // 位置价值（中心位置更有价值）
  const centerDist = Math.abs(row - 7) + Math.abs(col - 7);
  score += (14 - centerDist) * 5;

  return score;
}

// 获取所有可能的落子位置（只考虑有棋子周围的空位）
function getCandidateMoves(board) {
  const candidates = new Set();
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1],
  ];

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col] !== 0) {
        // 检查周围8个方向
        for (const [dx, dy] of directions) {
          const newRow = row + dx;
          const newCol = col + dy;
          if (
            newRow >= 0 && newRow < BOARD_SIZE &&
            newCol >= 0 && newCol < BOARD_SIZE &&
            board[newRow][newCol] === 0
          ) {
            candidates.add(`${newRow},${newCol}`);
          }
        }
      }
    }
  }

  // 如果棋盘为空，返回中心位置
  if (candidates.size === 0) {
    return [{ row: 7, col: 7 }];
  }

  return Array.from(candidates).map(pos => {
    const [row, col] = pos.split(',').map(Number);
    return { row, col };
  });
}

// 检查是否有必须防守的威胁（活四、冲四、活三）
function findCriticalThreats(board, opponentPlayer) {
  const threats = [];
  const directions = [
    [0, 1],   // 横向
    [1, 0],   // 纵向
    [1, 1],   // 主对角线
    [1, -1],  // 副对角线
  ];

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col] === 0) {
        const threat = checkOpponentThreat(board, row, col, opponentPlayer);
        if (threat && (threat.liveFour > 0 || threat.rushFour > 0 || threat.liveThree > 0)) {
          threats.push({ row, col, threat });
        }
      }
    }
  }

  return threats;
}

// AI选择最佳落子位置
export function getAIMove(board, aiPlayer = -1) {
  // aiPlayer = -1 表示白子（AI）
  const opponentPlayer = -aiPlayer; // 1 表示黑子（人类）

  // 首先检查是否有必须防守的威胁（活四、冲四、活三）
  const criticalThreats = findCriticalThreats(board, opponentPlayer);
  if (criticalThreats.length > 0) {
    // 优先防守活四
    const liveFourThreats = criticalThreats.filter(t => t.threat.liveFour > 0);
    if (liveFourThreats.length > 0) {
      return { row: liveFourThreats[0].row, col: liveFourThreats[0].col };
    }
    // 然后防守冲四
    const rushFourThreats = criticalThreats.filter(t => t.threat.rushFour > 0);
    if (rushFourThreats.length > 0) {
      return { row: rushFourThreats[0].row, col: rushFourThreats[0].col };
    }
    // 最后防守活三
    const liveThreeThreats = criticalThreats.filter(t => t.threat.liveThree > 0);
    if (liveThreeThreats.length > 0) {
      return { row: liveThreeThreats[0].row, col: liveThreeThreats[0].col };
    }
  }

  const candidates = getCandidateMoves(board);
  
  if (candidates.length === 0) {
    return { row: 7, col: 7 }; // 默认中心位置
  }

  // 评估所有候选位置
  const scoredMoves = candidates.map(({ row, col }) => {
    const score = evaluatePosition(board, row, col, aiPlayer);
    return { row, col, score };
  });

  // 按分数排序，选择最高分的位置
  scoredMoves.sort((a, b) => b.score - a.score);

  // 如果最高分位置有多个，随机选择一个（增加变化性）
  const topScore = scoredMoves[0].score;
  const topMoves = scoredMoves.filter(m => m.score === topScore);
  const selectedMove = topMoves[Math.floor(Math.random() * topMoves.length)];

  // 返回对象格式 {row, col}
  return { row: selectedMove.row, col: selectedMove.col };
}

// 检查是否有五连
export function checkFiveInRow(board, row, col, player) {
  const directions = [
    [[0, 1], [0, -1]],   // 横向
    [[1, 0], [-1, 0]],   // 纵向
    [[1, 1], [-1, -1]],  // 主对角线
    [[1, -1], [-1, 1]]   // 副对角线
  ];

  for (const [forward, backward] of directions) {
    let count = 1;

    // 向前检查
    let r = row + forward[0];
    let c = col + forward[1];
    while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
      count++;
      r += forward[0];
      c += forward[1];
    }

    // 向后检查
    r = row + backward[0];
    c = col + backward[1];
    while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
      count++;
      r += backward[0];
      c += backward[1];
    }

    if (count >= 5) {
      return true;
    }
  }

  return false;
}
