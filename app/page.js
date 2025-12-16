'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Search, Plus, X, TrendingUp, TrendingDown, Minus, Trophy, Target, Users, BarChart3, Zap, Shield, Crosshair } from 'lucide-react';

const CATEGORIES = [
  { key: 'pts', label: 'PTS', fullName: 'Points', icon: Target, positive: true },
  { key: 'reb', label: 'REB', fullName: 'Rebounds', icon: Shield, positive: true },
  { key: 'ast', label: 'AST', fullName: 'Assists', icon: Users, positive: true },
  { key: 'stl', label: 'STL', fullName: 'Steals', icon: Zap, positive: true },
  { key: 'blk', label: 'BLK', fullName: 'Blocks', icon: Shield, positive: true },
  { key: 'fg3m', label: '3PM', fullName: '3-Pointers Made', icon: Crosshair, positive: true },
  { key: 'fg_pct', label: 'FG%', fullName: 'Field Goal %', icon: Target, positive: true },
  { key: 'ft_pct', label: 'FT%', fullName: 'Free Throw %', icon: Target, positive: true },
  { key: 'turnover', label: 'TO', fullName: 'Turnovers', icon: TrendingDown, positive: false },
];

const LEAGUE_AVERAGES = {
  pts: 11.5, reb: 4.5, ast: 2.5, stl: 0.7, blk: 0.5, fg3m: 1.2, fg_pct: 0.46, ft_pct: 0.78, turnover: 1.3,
};

const ELITE_THRESHOLDS = {
  pts: 25, reb: 10, ast: 8, stl: 1.5, blk: 1.5, fg3m: 3, fg_pct: 0.52, ft_pct: 0.88, turnover: 1.5,
};

const DEMO_PLAYERS = [
  { id: 1, first_name: 'LeBron', last_name: 'James', position: 'F', team: { abbreviation: 'LAL' } },
  { id: 2, first_name: 'Stephen', last_name: 'Curry', position: 'G', team: { abbreviation: 'GSW' } },
  { id: 3, first_name: 'Giannis', last_name: 'Antetokounmpo', position: 'F', team: { abbreviation: 'MIL' } },
  { id: 4, first_name: 'Luka', last_name: 'Doncic', position: 'G', team: { abbreviation: 'DAL' } },
  { id: 5, first_name: 'Nikola', last_name: 'Jokic', position: 'C', team: { abbreviation: 'DEN' } },
  { id: 6, first_name: 'Kevin', last_name: 'Durant', position: 'F', team: { abbreviation: 'PHX' } },
  { id: 7, first_name: 'Joel', last_name: 'Embiid', position: 'C', team: { abbreviation: 'PHI' } },
  { id: 8, first_name: 'Jayson', last_name: 'Tatum', position: 'F', team: { abbreviation: 'BOS' } },
  { id: 9, first_name: 'Anthony', last_name: 'Davis', position: 'F-C', team: { abbreviation: 'LAL' } },
  { id: 10, first_name: 'Shai', last_name: 'Gilgeous-Alexander', position: 'G', team: { abbreviation: 'OKC' } },
  { id: 11, first_name: 'Jaylen', last_name: 'Brown', position: 'G-F', team: { abbreviation: 'BOS' } },
  { id: 12, first_name: 'Donovan', last_name: 'Mitchell', position: 'G', team: { abbreviation: 'CLE' } },
  { id: 13, first_name: 'Trae', last_name: 'Young', position: 'G', team: { abbreviation: 'ATL' } },
  { id: 14, first_name: 'Damian', last_name: 'Lillard', position: 'G', team: { abbreviation: 'MIL' } },
  { id: 15, first_name: 'Kyrie', last_name: 'Irving', position: 'G', team: { abbreviation: 'DAL' } },
  { id: 16, first_name: 'Devin', last_name: 'Booker', position: 'G', team: { abbreviation: 'PHX' } },
  { id: 17, first_name: 'Jimmy', last_name: 'Butler', position: 'F', team: { abbreviation: 'MIA' } },
  { id: 18, first_name: 'Bam', last_name: 'Adebayo', position: 'C', team: { abbreviation: 'MIA' } },
  { id: 19, first_name: 'De\'Aaron', last_name: 'Fox', position: 'G', team: { abbreviation: 'SAC' } },
  { id: 20, first_name: 'Domantas', last_name: 'Sabonis', position: 'C', team: { abbreviation: 'SAC' } },
  { id: 21, first_name: 'Tyrese', last_name: 'Haliburton', position: 'G', team: { abbreviation: 'IND' } },
  { id: 22, first_name: 'Tyrese', last_name: 'Maxey', position: 'G', team: { abbreviation: 'PHI' } },
  { id: 23, first_name: 'Jalen', last_name: 'Brunson', position: 'G', team: { abbreviation: 'NYK' } },
  { id: 24, first_name: 'Paolo', last_name: 'Banchero', position: 'F', team: { abbreviation: 'ORL' } },
  { id: 25, first_name: 'Chet', last_name: 'Holmgren', position: 'C', team: { abbreviation: 'OKC' } },
  { id: 26, first_name: 'Victor', last_name: 'Wembanyama', position: 'C', team: { abbreviation: 'SAS' } },
  { id: 27, first_name: 'Anthony', last_name: 'Edwards', position: 'G', team: { abbreviation: 'MIN' } },
  { id: 28, first_name: 'Karl-Anthony', last_name: 'Towns', position: 'C', team: { abbreviation: 'NYK' } },
  { id: 29, first_name: 'Rudy', last_name: 'Gobert', position: 'C', team: { abbreviation: 'MIN' } },
  { id: 30, first_name: 'Ja', last_name: 'Morant', position: 'G', team: { abbreviation: 'MEM' } },
  { id: 31, first_name: 'Zion', last_name: 'Williamson', position: 'F', team: { abbreviation: 'NOP' } },
  { id: 32, first_name: 'Brandon', last_name: 'Ingram', position: 'F', team: { abbreviation: 'NOP' } },
  { id: 33, first_name: 'CJ', last_name: 'McCollum', position: 'G', team: { abbreviation: 'NOP' } },
  { id: 34, first_name: 'Kawhi', last_name: 'Leonard', position: 'F', team: { abbreviation: 'LAC' } },
  { id: 35, first_name: 'Paul', last_name: 'George', position: 'F', team: { abbreviation: 'PHI' } },
  { id: 36, first_name: 'James', last_name: 'Harden', position: 'G', team: { abbreviation: 'LAC' } },
  { id: 37, first_name: 'Pascal', last_name: 'Siakam', position: 'F', team: { abbreviation: 'IND' } },
  { id: 38, first_name: 'Scottie', last_name: 'Barnes', position: 'F', team: { abbreviation: 'TOR' } },
  { id: 39, first_name: 'Evan', last_name: 'Mobley', position: 'F-C', team: { abbreviation: 'CLE' } },
  { id: 40, first_name: 'Jarrett', last_name: 'Allen', position: 'C', team: { abbreviation: 'CLE' } },
  { id: 41, first_name: 'Myles', last_name: 'Turner', position: 'C', team: { abbreviation: 'IND' } },
  { id: 42, first_name: 'Kristaps', last_name: 'Porzingis', position: 'C', team: { abbreviation: 'BOS' } },
  { id: 43, first_name: 'Derrick', last_name: 'White', position: 'G', team: { abbreviation: 'BOS' } },
  { id: 44, first_name: 'Jrue', last_name: 'Holiday', position: 'G', team: { abbreviation: 'BOS' } },
  { id: 45, first_name: 'Mikal', last_name: 'Bridges', position: 'F', team: { abbreviation: 'NYK' } },
  { id: 46, first_name: 'OG', last_name: 'Anunoby', position: 'F', team: { abbreviation: 'NYK' } },
  { id: 47, first_name: 'Desmond', last_name: 'Bane', position: 'G', team: { abbreviation: 'MEM' } },
  { id: 48, first_name: 'Jaren', last_name: 'Jackson Jr.', position: 'F-C', team: { abbreviation: 'MEM' } },
  { id: 49, first_name: 'Franz', last_name: 'Wagner', position: 'F', team: { abbreviation: 'ORL' } },
  { id: 50, first_name: 'Lauri', last_name: 'Markkanen', position: 'F', team: { abbreviation: 'UTA' } },
  { id: 51, first_name: 'Anfernee', last_name: 'Simons', position: 'G', team: { abbreviation: 'POR' } },
  { id: 52, first_name: 'Dejounte', last_name: 'Murray', position: 'G', team: { abbreviation: 'NOP' } },
  { id: 53, first_name: 'Fred', last_name: 'VanVleet', position: 'G', team: { abbreviation: 'HOU' } },
  { id: 54, first_name: 'Alperen', last_name: 'Sengun', position: 'C', team: { abbreviation: 'HOU' } },
  { id: 55, first_name: 'Jalen', last_name: 'Green', position: 'G', team: { abbreviation: 'HOU' } },
  { id: 56, first_name: 'Draymond', last_name: 'Green', position: 'F', team: { abbreviation: 'GSW' } },
  { id: 57, first_name: 'Klay', last_name: 'Thompson', position: 'G', team: { abbreviation: 'DAL' } },
  { id: 58, first_name: 'Andrew', last_name: 'Wiggins', position: 'F', team: { abbreviation: 'GSW' } },
  { id: 59, first_name: 'Brook', last_name: 'Lopez', position: 'C', team: { abbreviation: 'MIL' } },
  { id: 60, first_name: 'Khris', last_name: 'Middleton', position: 'F', team: { abbreviation: 'MIL' } },
];

const DEMO_STATS = {
  1: { pts: 25.7, reb: 7.3, ast: 8.3, stl: 1.3, blk: 0.5, fg3m: 2.1, fg_pct: 0.54, ft_pct: 0.75, turnover: 3.5, games: 55 },
  2: { pts: 26.4, reb: 4.5, ast: 6.1, stl: 0.7, blk: 0.4, fg3m: 4.8, fg_pct: 0.45, ft_pct: 0.92, turnover: 2.8, games: 74 },
  3: { pts: 30.4, reb: 11.5, ast: 6.5, stl: 1.2, blk: 1.1, fg3m: 0.9, fg_pct: 0.61, ft_pct: 0.66, turnover: 3.4, games: 73 },
  4: { pts: 33.9, reb: 9.2, ast: 9.8, stl: 1.4, blk: 0.5, fg3m: 4.1, fg_pct: 0.49, ft_pct: 0.79, turnover: 4.0, games: 70 },
  5: { pts: 26.4, reb: 12.4, ast: 9.0, stl: 1.4, blk: 0.9, fg3m: 1.0, fg_pct: 0.58, ft_pct: 0.82, turnover: 3.0, games: 79 },
  6: { pts: 27.1, reb: 6.6, ast: 5.0, stl: 0.9, blk: 1.2, fg3m: 2.2, fg_pct: 0.52, ft_pct: 0.86, turnover: 3.3, games: 75 },
  7: { pts: 34.7, reb: 11.0, ast: 5.6, stl: 1.2, blk: 1.7, fg3m: 1.0, fg_pct: 0.53, ft_pct: 0.88, turnover: 3.8, games: 39 },
  8: { pts: 26.9, reb: 8.1, ast: 4.9, stl: 1.0, blk: 0.6, fg3m: 3.1, fg_pct: 0.47, ft_pct: 0.83, turnover: 2.5, games: 74 },
  9: { pts: 24.7, reb: 12.6, ast: 3.5, stl: 1.2, blk: 2.3, fg3m: 0.5, fg_pct: 0.56, ft_pct: 0.76, turnover: 2.1, games: 76 },
  10: { pts: 30.1, reb: 5.5, ast: 6.2, stl: 2.0, blk: 0.9, fg3m: 2.0, fg_pct: 0.54, ft_pct: 0.87, turnover: 2.2, games: 75 },
  11: { pts: 23.0, reb: 5.5, ast: 3.6, stl: 1.2, blk: 0.5, fg3m: 2.3, fg_pct: 0.49, ft_pct: 0.71, turnover: 2.4, games: 70 },
  12: { pts: 26.6, reb: 5.1, ast: 6.1, stl: 1.8, blk: 0.4, fg3m: 3.2, fg_pct: 0.46, ft_pct: 0.87, turnover: 2.9, games: 55 },
  13: { pts: 25.7, reb: 2.8, ast: 10.8, stl: 1.1, blk: 0.2, fg3m: 2.8, fg_pct: 0.43, ft_pct: 0.89, turnover: 4.1, games: 54 },
  14: { pts: 24.3, reb: 4.4, ast: 7.0, stl: 1.0, blk: 0.3, fg3m: 3.4, fg_pct: 0.42, ft_pct: 0.92, turnover: 2.9, games: 73 },
  15: { pts: 25.6, reb: 5.0, ast: 5.2, stl: 1.3, blk: 0.5, fg3m: 2.8, fg_pct: 0.49, ft_pct: 0.90, turnover: 2.3, games: 58 },
  16: { pts: 27.1, reb: 4.5, ast: 6.9, stl: 1.0, blk: 0.4, fg3m: 2.5, fg_pct: 0.49, ft_pct: 0.88, turnover: 3.0, games: 68 },
  17: { pts: 20.8, reb: 5.3, ast: 5.0, stl: 1.3, blk: 0.3, fg3m: 0.8, fg_pct: 0.50, ft_pct: 0.85, turnover: 1.7, games: 60 },
  18: { pts: 19.3, reb: 10.4, ast: 3.9, stl: 1.1, blk: 0.9, fg3m: 0.2, fg_pct: 0.52, ft_pct: 0.72, turnover: 2.5, games: 71 },
  19: { pts: 26.6, reb: 4.6, ast: 5.6, stl: 2.0, blk: 0.4, fg3m: 1.5, fg_pct: 0.47, ft_pct: 0.74, turnover: 2.9, games: 58 },
  20: { pts: 19.4, reb: 13.7, ast: 8.2, stl: 1.0, blk: 0.5, fg3m: 0.6, fg_pct: 0.60, ft_pct: 0.73, turnover: 3.4, games: 82 },
  21: { pts: 20.1, reb: 3.9, ast: 10.9, stl: 1.2, blk: 0.7, fg3m: 2.9, fg_pct: 0.47, ft_pct: 0.85, turnover: 2.5, games: 69 },
  22: { pts: 25.9, reb: 3.7, ast: 6.2, stl: 1.0, blk: 0.5, fg3m: 2.7, fg_pct: 0.45, ft_pct: 0.86, turnover: 1.9, games: 70 },
  23: { pts: 28.7, reb: 3.6, ast: 6.7, stl: 0.9, blk: 0.2, fg3m: 2.2, fg_pct: 0.48, ft_pct: 0.84, turnover: 2.4, games: 77 },
  24: { pts: 22.6, reb: 6.9, ast: 5.4, stl: 1.0, blk: 0.6, fg3m: 1.2, fg_pct: 0.45, ft_pct: 0.73, turnover: 3.0, games: 80 },
  25: { pts: 16.5, reb: 7.9, ast: 2.4, stl: 0.8, blk: 2.3, fg3m: 1.6, fg_pct: 0.53, ft_pct: 0.79, turnover: 1.7, games: 82 },
  26: { pts: 21.4, reb: 10.6, ast: 3.9, stl: 1.2, blk: 3.6, fg3m: 1.2, fg_pct: 0.47, ft_pct: 0.80, turnover: 3.7, games: 71 },
  27: { pts: 25.9, reb: 5.4, ast: 5.1, stl: 1.3, blk: 0.5, fg3m: 2.8, fg_pct: 0.46, ft_pct: 0.83, turnover: 2.6, games: 79 },
  28: { pts: 25.6, reb: 8.3, ast: 3.0, stl: 0.7, blk: 0.6, fg3m: 2.6, fg_pct: 0.50, ft_pct: 0.87, turnover: 2.9, games: 62 },
  29: { pts: 14.0, reb: 12.9, ast: 2.0, stl: 0.7, blk: 2.1, fg3m: 0.0, fg_pct: 0.66, ft_pct: 0.68, turnover: 1.6, games: 76 },
  30: { pts: 25.1, reb: 5.6, ast: 8.1, stl: 0.8, blk: 0.3, fg3m: 1.5, fg_pct: 0.47, ft_pct: 0.75, turnover: 3.0, games: 9 },
  31: { pts: 22.9, reb: 5.8, ast: 5.0, stl: 1.1, blk: 0.6, fg3m: 0.4, fg_pct: 0.57, ft_pct: 0.70, turnover: 2.8, games: 70 },
  32: { pts: 20.8, reb: 5.1, ast: 5.7, stl: 0.9, blk: 0.6, fg3m: 2.0, fg_pct: 0.45, ft_pct: 0.83, turnover: 2.3, games: 64 },
  33: { pts: 18.5, reb: 4.1, ast: 5.9, stl: 0.9, blk: 0.3, fg3m: 2.9, fg_pct: 0.44, ft_pct: 0.84, turnover: 1.8, games: 59 },
  34: { pts: 23.7, reb: 6.1, ast: 3.6, stl: 1.6, blk: 0.9, fg3m: 1.5, fg_pct: 0.52, ft_pct: 0.88, turnover: 2.0, games: 52 },
  35: { pts: 22.6, reb: 5.2, ast: 3.5, stl: 1.5, blk: 0.4, fg3m: 2.6, fg_pct: 0.45, ft_pct: 0.90, turnover: 2.1, games: 74 },
  36: { pts: 16.6, reb: 5.1, ast: 8.5, stl: 1.1, blk: 0.5, fg3m: 1.8, fg_pct: 0.44, ft_pct: 0.88, turnover: 2.7, games: 72 },
  37: { pts: 21.3, reb: 7.8, ast: 3.8, stl: 0.7, blk: 0.5, fg3m: 1.2, fg_pct: 0.54, ft_pct: 0.77, turnover: 2.3, games: 71 },
  38: { pts: 19.9, reb: 8.2, ast: 6.1, stl: 1.3, blk: 1.5, fg3m: 0.9, fg_pct: 0.48, ft_pct: 0.77, turnover: 2.9, games: 60 },
  39: { pts: 15.7, reb: 9.4, ast: 3.2, stl: 0.8, blk: 1.5, fg3m: 0.5, fg_pct: 0.58, ft_pct: 0.70, turnover: 1.9, games: 68 },
  40: { pts: 16.5, reb: 10.5, ast: 1.7, stl: 0.8, blk: 1.3, fg3m: 0.2, fg_pct: 0.64, ft_pct: 0.68, turnover: 1.4, games: 77 },
  41: { pts: 17.1, reb: 6.9, ast: 1.4, stl: 0.6, blk: 2.0, fg3m: 2.0, fg_pct: 0.52, ft_pct: 0.78, turnover: 1.2, games: 78 },
  42: { pts: 20.1, reb: 7.2, ast: 2.0, stl: 0.7, blk: 1.9, fg3m: 2.2, fg_pct: 0.52, ft_pct: 0.86, turnover: 1.5, games: 57 },
  43: { pts: 15.2, reb: 4.2, ast: 5.2, stl: 1.0, blk: 1.0, fg3m: 2.4, fg_pct: 0.46, ft_pct: 0.86, turnover: 1.8, games: 73 },
  44: { pts: 12.5, reb: 5.4, ast: 4.8, stl: 1.6, blk: 0.7, fg3m: 1.8, fg_pct: 0.48, ft_pct: 0.86, turnover: 1.7, games: 69 },
  45: { pts: 19.6, reb: 4.5, ast: 3.6, stl: 0.9, blk: 0.6, fg3m: 2.7, fg_pct: 0.44, ft_pct: 0.75, turnover: 1.8, games: 82 },
  46: { pts: 14.1, reb: 4.4, ast: 2.1, stl: 1.5, blk: 0.6, fg3m: 1.8, fg_pct: 0.49, ft_pct: 0.78, turnover: 1.3, games: 50 },
  47: { pts: 22.7, reb: 4.4, ast: 4.8, stl: 1.0, blk: 0.4, fg3m: 3.4, fg_pct: 0.44, ft_pct: 0.87, turnover: 1.9, games: 42 },
  48: { pts: 22.5, reb: 5.5, ast: 2.3, stl: 1.0, blk: 2.3, fg3m: 1.6, fg_pct: 0.47, ft_pct: 0.80, turnover: 2.5, games: 66 },
  49: { pts: 21.0, reb: 5.3, ast: 5.6, stl: 1.1, blk: 0.4, fg3m: 1.8, fg_pct: 0.48, ft_pct: 0.84, turnover: 2.1, games: 72 },
  50: { pts: 23.2, reb: 8.2, ast: 2.0, stl: 0.6, blk: 0.6, fg3m: 2.4, fg_pct: 0.48, ft_pct: 0.90, turnover: 1.8, games: 55 },
  51: { pts: 22.6, reb: 2.6, ast: 4.9, stl: 0.7, blk: 0.2, fg3m: 3.5, fg_pct: 0.43, ft_pct: 0.88, turnover: 2.2, games: 70 },
  52: { pts: 18.3, reb: 5.3, ast: 6.1, stl: 1.5, blk: 0.3, fg3m: 1.1, fg_pct: 0.44, ft_pct: 0.79, turnover: 2.5, games: 60 },
  53: { pts: 14.6, reb: 3.8, ast: 5.8, stl: 1.3, blk: 0.3, fg3m: 2.3, fg_pct: 0.40, ft_pct: 0.86, turnover: 2.0, games: 73 },
  54: { pts: 19.2, reb: 9.3, ast: 5.0, stl: 1.0, blk: 0.9, fg3m: 0.6, fg_pct: 0.54, ft_pct: 0.72, turnover: 3.6, games: 63 },
  55: { pts: 19.6, reb: 5.2, ast: 3.5, stl: 0.8, blk: 0.4, fg3m: 2.4, fg_pct: 0.42, ft_pct: 0.83, turnover: 2.1, games: 67 },
  56: { pts: 8.6, reb: 7.2, ast: 6.0, stl: 1.0, blk: 0.9, fg3m: 0.6, fg_pct: 0.49, ft_pct: 0.73, turnover: 2.5, games: 55 },
  57: { pts: 17.9, reb: 3.3, ast: 2.3, stl: 0.7, blk: 0.4, fg3m: 3.4, fg_pct: 0.43, ft_pct: 0.92, turnover: 1.4, games: 77 },
  58: { pts: 13.2, reb: 4.5, ast: 1.7, stl: 0.6, blk: 0.6, fg3m: 1.5, fg_pct: 0.45, ft_pct: 0.67, turnover: 1.3, games: 71 },
  59: { pts: 12.5, reb: 5.2, ast: 1.6, stl: 0.4, blk: 2.4, fg3m: 1.8, fg_pct: 0.48, ft_pct: 0.77, turnover: 0.9, games: 78 },
  60: { pts: 15.1, reb: 4.5, ast: 5.3, stl: 0.8, blk: 0.2, fg3m: 1.9, fg_pct: 0.44, ft_pct: 0.88, turnover: 2.1, games: 55 },
};

export default function NBAFantasyAnalyzer() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [team, setTeam] = useState([]);
  const [playerStats, setPlayerStats] = useState({});
  const [loadingStats, setLoadingStats] = useState({});
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('roster');
  const [dataMode, setDataMode] = useState(null);
  const [isCheckingApi, setIsCheckingApi] = useState(true);

  useEffect(() => {
    const checkApi = async () => {
      try {
        const response = await fetch('/api/nba/players?search=lebron');
        if (response.ok) {
          setDataMode('live');
        } else {
          setDataMode('demo');
        }
      } catch {
        setDataMode('demo');
      } finally {
        setIsCheckingApi(false);
      }
    };
    checkApi();
  }, []);

  const searchPlayers = useCallback(async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    setError('');
    if (dataMode === 'demo') {
      const filtered = DEMO_PLAYERS.filter(p =>
        `${p.first_name} ${p.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
      setIsSearching(false);
      return;
    }
    try {
      const response = await fetch(`/api/nba/players?search=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) throw new Error('API error');
      const data = await response.json();
      setSearchResults(data.data || []);
    } catch (err) {
      console.error('Search error:', err);
      setSearchResults([]);
      setError('Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery, dataMode]);

  useEffect(() => {
    if (!dataMode) return;
    const timer = setTimeout(() => { searchPlayers(); }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, searchPlayers, dataMode]);

  const fetchPlayerStats = async (playerId) => {
    if (DEMO_STATS[playerId]) {
      setPlayerStats(prev => ({ ...prev, [playerId]: DEMO_STATS[playerId] }));
      return;
    }
    if (dataMode === 'demo') return;
    setLoadingStats(prev => ({ ...prev, [playerId]: true }));
    try {
      const response = await fetch(`/api/nba/stats?player_id=${playerId}`);
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      if (data.data && data.data.length > 0) {
        const stats = data.data[0];
        setPlayerStats(prev => ({
          ...prev,
          [playerId]: {
            pts: stats.pts || 0, reb: stats.reb || 0, ast: stats.ast || 0, stl: stats.stl || 0,
            blk: stats.blk || 0, fg3m: stats.fg3m || 0, fg_pct: stats.fg_pct || 0, ft_pct: stats.ft_pct || 0,
            turnover: stats.turnover || 0, games: stats.games_played || 0,
          }
        }));
      }
    } catch (err) {
      console.error('Failed to fetch player stats:', err);
    } finally {
      setLoadingStats(prev => ({ ...prev, [playerId]: false }));
    }
  };

  const addPlayer = (player) => {
    if (team.find(p => p.id === player.id)) return;
    if (team.length >= 13) { setError('Maximum 13 players allowed'); return; }
    setTeam([...team, player]);
    fetchPlayerStats(player.id);
    setSearchQuery('');
    setSearchResults([]);
  };

  const removePlayer = (playerId) => { setTeam(team.filter(p => p.id !== playerId)); };

  const analyzeTeam = () => {
    if (team.length === 0) return null;
    const totals = {};
    const playerCount = team.filter(p => playerStats[p.id]).length;
    CATEGORIES.forEach(cat => { totals[cat.key] = 0; });
    team.forEach(player => {
      const stats = playerStats[player.id];
      if (stats) { CATEGORIES.forEach(cat => { totals[cat.key] += stats[cat.key] || 0; }); }
    });
    const averages = {};
    CATEGORIES.forEach(cat => {
      if (cat.key === 'fg_pct' || cat.key === 'ft_pct') {
        averages[cat.key] = playerCount > 0 ? totals[cat.key] / playerCount : 0;
      } else { averages[cat.key] = totals[cat.key]; }
    });
    const scores = {};
    CATEGORIES.forEach(cat => {
      const value = averages[cat.key];
      const elite = ELITE_THRESHOLDS[cat.key];
      if (cat.positive) {
        if (cat.key === 'fg_pct' || cat.key === 'ft_pct') {
          scores[cat.key] = Math.min(100, Math.max(0, ((value - 0.3) / (elite - 0.3)) * 100));
        } else {
          const teamElite = elite * playerCount;
          scores[cat.key] = Math.min(100, Math.max(0, (value / teamElite) * 100));
        }
      } else {
        const teamAvg = LEAGUE_AVERAGES[cat.key] * playerCount;
        scores[cat.key] = Math.min(100, Math.max(0, 100 - ((value / (teamAvg * 2)) * 100)));
      }
    });
    const ranked = CATEGORIES.map(cat => ({
      ...cat, value: averages[cat.key], total: totals[cat.key], score: scores[cat.key],
    })).sort((a, b) => b.score - a.score);
    return { totals, averages, scores, ranked, playerCount };
  };

  const analysis = analyzeTeam();
  const getCategoryGrade = (score) => {
    if (score >= 85) return { grade: 'A+', color: '#10b981' };
    if (score >= 75) return { grade: 'A', color: '#22c55e' };
    if (score >= 65) return { grade: 'B+', color: '#84cc16' };
    if (score >= 55) return { grade: 'B', color: '#eab308' };
    if (score >= 45) return { grade: 'C+', color: '#f97316' };
    if (score >= 35) return { grade: 'C', color: '#ef4444' };
    return { grade: 'D', color: '#dc2626' };
  };
  const getStrengthIcon = (score) => {
    if (score >= 65) return <TrendingUp size={16} />;
    if (score >= 45) return <Minus size={16} />;
    return <TrendingDown size={16} />;
  };

  if (isCheckingApi) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
        <Trophy size={48} style={{ color: '#6366f1' }} />
        <p style={{ color: '#94a3b8' }}>Loading Fantasy Analyzer...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', fontFamily: '"Outfit", system-ui, sans-serif', color: '#e2e8f0' }}>
      <style>{`
        @keyframes slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes gradient-shift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .card { background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; backdrop-filter: blur(10px); }
        .card-hover:hover { border-color: rgba(99, 102, 241, 0.3); transform: translateY(-2px); transition: all 0.3s ease; }
        .input-field { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 14px 16px; color: white; font-size: 15px; width: 100%; outline: none; transition: all 0.3s ease; }
        .input-field:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2); }
        .input-field::placeholder { color: #64748b; }
        .stat-bar { height: 8px; background: rgba(255, 255, 255, 0.1); border-radius: 4px; overflow: hidden; }
        .stat-bar-fill { height: 100%; border-radius: 4px; transition: width 0.5s ease; }
        .tab-active { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; }
        .tab-inactive { background: transparent; color: #64748b; }
        .player-card { animation: slide-up 0.3s ease forwards; }
        .gradient-text { background: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-size: 200% 200%; animation: gradient-shift 3s ease infinite; }
      `}</style>

      <header style={{ padding: '24px 32px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: 48, height: 48, borderRadius: '14px', background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)' }}>
            <Trophy size={24} color="white" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em' }}><span className="gradient-text">9-Cat</span> Fantasy Analyzer</h1>
            <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Build and analyze your NBA fantasy team</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: dataMode === 'live' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(234, 179, 8, 0.1)', borderRadius: '8px', fontSize: '13px', color: dataMode === 'live' ? '#10b981' : '#eab308' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: dataMode === 'live' ? '#10b981' : '#eab308' }} />
          {dataMode === 'live' ? 'Live Data' : 'Demo Mode (60 Players)'}
        </div>
      </header>

      <main style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 400px', gap: '24px' }}>
          <div>
            <div className="card" style={{ padding: '20px', marginBottom: '24px' }}>
              <div style={{ position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input type="text" className="input-field" style={{ paddingLeft: '48px' }} placeholder="Search players..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
              {searchResults.length > 0 && (
                <div style={{ marginTop: '12px', maxHeight: '300px', overflowY: 'auto' }}>
                  {searchResults.map((player) => (
                    <div key={player.id} className="card-hover" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', marginBottom: '8px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '10px', cursor: 'pointer', border: '1px solid transparent' }} onClick={() => addPlayer(player)}>
                      <div>
                        <p style={{ margin: 0, fontWeight: 500 }}>{player.first_name} {player.last_name}</p>
                        <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>{player.team?.abbreviation || 'FA'} • {player.position || 'N/A'}</p>
                      </div>
                      <button style={{ width: 32, height: 32, borderRadius: '8px', background: 'rgba(99, 102, 241, 0.2)', border: 'none', color: '#6366f1', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Plus size={16} /></button>
                    </div>
                  ))}
                </div>
              )}
              {isSearching && <p style={{ margin: '12px 0 0', color: '#64748b', fontSize: '13px' }}>Searching...</p>}
            </div>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              {['roster', 'analysis'].map((tab) => (
                <button key={tab} className={activeTab === tab ? 'tab-active' : 'tab-inactive'} onClick={() => setActiveTab(tab)} style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', fontSize: '14px', fontWeight: 500, cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.2s ease' }}>
                  {tab === 'roster' ? 'My Roster' : 'Category Analysis'}
                </button>
              ))}
            </div>

            {activeTab === 'roster' && (
              <div className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Team Roster</h3>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>{team.length}/13 players</span>
                </div>
                {team.length === 0 ? (
                  <div style={{ padding: '48px 24px', textAlign: 'center', color: '#64748b' }}>
                    <Users size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
                    <p style={{ margin: 0, fontSize: '14px' }}>Search and add players to build your team</p>
                  </div>
                ) : (
                  <div>
                    {team.map((player, index) => {
                      const stats = playerStats[player.id];
                      return (
                        <div key={player.id} className="player-card" style={{ display: 'flex', alignItems: 'center', padding: '16px', marginBottom: '12px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)', animationDelay: `${index * 0.05}s` }}>
                          <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px', marginRight: '14px' }}>{player.first_name[0]}{player.last_name[0]}</div>
                          <div style={{ flex: 1 }}>
                            <p style={{ margin: 0, fontWeight: 500, fontSize: '14px' }}>{player.first_name} {player.last_name}</p>
                            <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>{player.team?.abbreviation || 'FA'} • {player.position || 'N/A'}</p>
                          </div>
                          {stats && (
                            <div style={{ display: 'flex', gap: '16px', marginRight: '16px' }}>
                              <div style={{ textAlign: 'center' }}><p style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>{stats.pts?.toFixed(1)}</p><p style={{ margin: 0, fontSize: '10px', color: '#64748b' }}>PTS</p></div>
                              <div style={{ textAlign: 'center' }}><p style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>{stats.reb?.toFixed(1)}</p><p style={{ margin: 0, fontSize: '10px', color: '#64748b' }}>REB</p></div>
                              <div style={{ textAlign: 'center' }}><p style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>{stats.ast?.toFixed(1)}</p><p style={{ margin: 0, fontSize: '10px', color: '#64748b' }}>AST</p></div>
                            </div>
                          )}
                          {loadingStats[player.id] && <span style={{ fontSize: '12px', color: '#64748b', marginRight: '16px' }}>Loading...</span>}
                          <button onClick={() => removePlayer(player.id)} style={{ width: 32, height: 32, borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={16} /></button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'analysis' && analysis && (
              <div className="card" style={{ padding: '20px' }}>
                <h3 style={{ margin: '0 0 20px', fontSize: '16px', fontWeight: 600 }}>Category Breakdown</h3>
                {analysis.ranked.map((cat) => {
                  const { grade, color } = getCategoryGrade(cat.score);
                  const IconComponent = cat.icon;
                  return (
                    <div key={cat.key} style={{ marginBottom: '20px', padding: '16px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: 32, height: 32, borderRadius: '8px', background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IconComponent size={16} style={{ color }} /></div>
                          <div>
                            <p style={{ margin: 0, fontWeight: 500, fontSize: '14px' }}>{cat.fullName}</p>
                            <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>{cat.key === 'fg_pct' || cat.key === 'ft_pct' ? `${(cat.value * 100).toFixed(1)}%` : cat.total.toFixed(1)} total</p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ color, fontSize: '13px' }}>{getStrengthIcon(cat.score)}</span>
                          <span style={{ padding: '4px 10px', borderRadius: '6px', background: `${color}20`, color, fontWeight: 600, fontSize: '13px', fontFamily: '"Space Mono", monospace' }}>{grade}</span>
                        </div>
                      </div>
                      <div className="stat-bar"><div className="stat-bar-fill" style={{ width: `${Math.min(100, cat.score)}%`, background: `linear-gradient(90deg, ${color}80, ${color})` }} /></div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <div className="card" style={{ padding: '24px', position: 'sticky', top: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <BarChart3 size={20} style={{ color: '#6366f1' }} />
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Team Summary</h3>
              </div>
              {!analysis ? (
                <div style={{ padding: '32px 16px', textAlign: 'center', color: '#64748b' }}>
                  <BarChart3 size={40} style={{ opacity: 0.3, marginBottom: '12px' }} />
                  <p style={{ margin: 0, fontSize: '13px' }}>Add players to see analysis</p>
                </div>
              ) : (
                <>
                  <div style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)', borderRadius: '16px', textAlign: 'center', marginBottom: '24px' }}>
                    <p style={{ margin: '0 0 8px', fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Overall Team Grade</p>
                    <p style={{ margin: 0, fontSize: '56px', fontWeight: 800, fontFamily: '"Space Mono", monospace', background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      {getCategoryGrade(analysis.ranked.reduce((acc, cat) => acc + cat.score, 0) / analysis.ranked.length).grade}
                    </p>
                  </div>
                  <div style={{ marginBottom: '24px' }}>
                    <h4 style={{ margin: '0 0 12px', fontSize: '12px', color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.1em' }}>⚡ Top Strengths</h4>
                    {analysis.ranked.slice(0, 3).map((cat) => (
                      <div key={cat.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', marginBottom: '8px', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                        <span style={{ fontSize: '13px', fontWeight: 500 }}>{cat.label}</span>
                        <span style={{ fontSize: '12px', color: '#10b981', fontFamily: '"Space Mono", monospace' }}>{getCategoryGrade(cat.score).grade}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginBottom: '24px' }}>
                    <h4 style={{ margin: '0 0 12px', fontSize: '12px', color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.1em' }}>⚠️ Areas to Improve</h4>
                    {analysis.ranked.slice(-3).reverse().map((cat) => (
                      <div key={cat.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', marginBottom: '8px', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '10px', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                        <span style={{ fontSize: '13px', fontWeight: 500 }}>{cat.label}</span>
                        <span style={{ fontSize: '12px', color: '#ef4444', fontFamily: '"Space Mono", monospace' }}>{getCategoryGrade(cat.score).grade}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 12px', fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Team Totals</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                      {CATEGORIES.map((cat) => {
                        const value = cat.key === 'fg_pct' || cat.key === 'ft_pct' ? analysis.averages[cat.key] : analysis.totals[cat.key];
                        return (
                          <div key={cat.key} style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '10px', textAlign: 'center' }}>
                            <p style={{ margin: 0, fontSize: '16px', fontWeight: 600, fontFamily: '"Space Mono", monospace' }}>{cat.key === 'fg_pct' || cat.key === 'ft_pct' ? `${(value * 100).toFixed(1)}%` : value.toFixed(1)}</p>
                            <p style={{ margin: '4px 0 0', fontSize: '10px', color: '#64748b', textTransform: 'uppercase' }}>{cat.label}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div style={{ position: 'fixed', bottom: '24px', right: '24px', padding: '16px 24px', background: 'rgba(239, 68, 68, 0.9)', borderRadius: '12px', color: 'white', fontSize: '14px', boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)', zIndex: 1000 }}>
            {error}
            <button onClick={() => setError('')} style={{ marginLeft: '16px', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X size={16} /></button>
          </div>
        )}
      </main>
    </div>
  );
}
