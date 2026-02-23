import React, { useState, useEffect, useCallback } from 'react';
import { Settings, Play, RotateCcw, Trophy, Check, X, Delete } from 'lucide-react';

const OPERATIONS = ['+', '-', '×', '÷'];

// ─── Object Visuals Library ───────────────────────────────────────────────────
// Each object has a name, a render function that draws a cute SVG, and a color
const OBJECT_TYPES = [
    {
        name: 'apple',
        render: (size) => (
            <svg viewBox="0 0 100 100" className={size}>
                <ellipse cx="50" cy="58" rx="35" ry="35" fill="#e74c3c" />
                <ellipse cx="50" cy="58" rx="35" ry="35" fill="url(#appleShine)" />
                <path d="M50 25 Q55 10 60 15 Q58 22 52 28" fill="#27ae60" />
                <path d="M48 28 Q42 15 38 18 Q42 24 47 28" fill="#2ecc71" />
                <ellipse cx="38" cy="48" rx="6" ry="10" fill="rgba(255,255,255,0.2)" transform="rotate(-15 38 48)" />
                <defs>
                    <radialGradient id="appleShine" cx="40%" cy="35%">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
                        <stop offset="100%" stopColor="transparent" />
                    </radialGradient>
                </defs>
            </svg>
        )
    },
    {
        name: 'orange',
        render: (size) => (
            <svg viewBox="0 0 100 100" className={size}>
                <circle cx="50" cy="55" r="35" fill="#f39c12" />
                <circle cx="50" cy="55" r="35" fill="url(#orangeShine)" />
                <ellipse cx="50" cy="24" rx="6" ry="4" fill="#27ae60" />
                <path d="M50 28 Q52 20 50 15" stroke="#795548" strokeWidth="2" fill="none" />
                <defs>
                    <radialGradient id="orangeShine" cx="40%" cy="35%">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
                        <stop offset="100%" stopColor="transparent" />
                    </radialGradient>
                </defs>
            </svg>
        )
    },
    {
        name: 'car',
        render: (size) => (
            <svg viewBox="0 0 100 100" className={size}>
                <rect x="10" y="45" width="80" height="25" rx="8" fill="#3498db" />
                <path d="M25 45 Q30 25 50 25 Q70 25 75 45" fill="#2980b9" />
                <rect x="32" y="30" width="15" height="14" rx="2" fill="#87ceeb" />
                <rect x="52" y="30" width="15" height="14" rx="2" fill="#87ceeb" />
                <circle cx="28" cy="72" r="8" fill="#2c3e50" />
                <circle cx="28" cy="72" r="4" fill="#95a5a6" />
                <circle cx="72" cy="72" r="8" fill="#2c3e50" />
                <circle cx="72" cy="72" r="4" fill="#95a5a6" />
                <rect x="75" y="50" width="12" height="6" rx="2" fill="#e74c3c" />
                <rect x="13" y="50" width="10" height="5" rx="2" fill="#f1c40f" />
            </svg>
        )
    },
    {
        name: 'ball',
        render: (size) => (
            <svg viewBox="0 0 100 100" className={size}>
                <circle cx="50" cy="50" r="35" fill="#e74c3c" />
                <path d="M15 50 Q50 30 85 50" stroke="white" strokeWidth="3" fill="none" />
                <path d="M15 50 Q50 70 85 50" stroke="white" strokeWidth="3" fill="none" />
                <path d="M50 15 Q30 50 50 85" stroke="white" strokeWidth="3" fill="none" />
                <path d="M50 15 Q70 50 50 85" stroke="white" strokeWidth="3" fill="none" />
                <circle cx="50" cy="50" r="35" fill="url(#ballShine)" />
                <defs>
                    <radialGradient id="ballShine" cx="35%" cy="30%">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
                        <stop offset="100%" stopColor="transparent" />
                    </radialGradient>
                </defs>
            </svg>
        )
    },
    {
        name: 'carrot',
        render: (size) => (
            <svg viewBox="0 0 100 100" className={size}>
                <path d="M50 90 Q45 50 35 30 Q50 35 65 30 Q55 50 50 90Z" fill="#e67e22" />
                <path d="M42 32 Q50 5 58 32" fill="#27ae60" />
                <path d="M38 35 Q42 15 50 30" fill="#2ecc71" />
                <path d="M62 35 Q58 15 50 30" fill="#2ecc71" />
                <line x1="46" y1="45" x2="44" y2="50" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
                <line x1="48" y1="55" x2="46" y2="60" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
                <line x1="50" y1="65" x2="48" y2="70" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
            </svg>
        )
    },
    {
        name: 'star',
        render: (size) => (
            <svg viewBox="0 0 100 100" className={size}>
                <polygon
                    points="50,10 61,38 92,38 67,56 76,85 50,68 24,85 33,56 8,38 39,38"
                    fill="#f1c40f"
                    stroke="#f39c12"
                    strokeWidth="2"
                />
                <polygon
                    points="50,10 61,38 92,38 67,56 76,85 50,68 24,85 33,56 8,38 39,38"
                    fill="url(#starShine)"
                />
                <defs>
                    <radialGradient id="starShine" cx="40%" cy="35%">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
                        <stop offset="100%" stopColor="transparent" />
                    </radialGradient>
                </defs>
            </svg>
        )
    },
    {
        name: 'flower',
        render: (size) => (
            <svg viewBox="0 0 100 100" className={size}>
                {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                    <ellipse key={i} cx="50" cy="30" rx="12" ry="18" fill={i % 2 === 0 ? '#e91e63' : '#f06292'}
                        transform={`rotate(${angle} 50 50)`} />
                ))}
                <circle cx="50" cy="50" r="12" fill="#ffc107" />
                <circle cx="47" cy="47" r="3" fill="#ff9800" />
                <circle cx="53" cy="53" r="2" fill="#ff9800" />
            </svg>
        )
    },
    {
        name: 'banana',
        render: (size) => (
            <svg viewBox="0 0 100 100" className={size}>
                <path d="M25 70 Q15 40 35 20 Q50 10 65 20 Q60 25 50 25 Q35 30 30 60 Q28 68 25 70Z" fill="#f1c40f" />
                <path d="M25 70 Q15 40 35 20 Q50 10 65 20 Q60 25 50 25 Q35 30 30 60 Q28 68 25 70Z" fill="url(#bananaShine)" />
                <path d="M63 22 Q67 18 70 22 Q68 24 65 23Z" fill="#8d6e63" />
                <defs>
                    <radialGradient id="bananaShine" cx="35%" cy="30%">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
                        <stop offset="100%" stopColor="transparent" />
                    </radialGradient>
                </defs>
            </svg>
        )
    },
    {
        name: 'fish',
        render: (size) => (
            <svg viewBox="0 0 100 100" className={size}>
                <ellipse cx="45" cy="50" rx="30" ry="20" fill="#3498db" />
                <polygon points="75,50 95,35 95,65" fill="#2980b9" />
                <circle cx="32" cy="45" r="4" fill="white" />
                <circle cx="33" cy="44" r="2" fill="#2c3e50" />
                <path d="M20 50 Q30 42 40 50" stroke="#2980b9" strokeWidth="2" fill="none" />
                <ellipse cx="45" cy="50" rx="30" ry="20" fill="url(#fishShine)" />
                <defs>
                    <radialGradient id="fishShine" cx="35%" cy="35%">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
                        <stop offset="100%" stopColor="transparent" />
                    </radialGradient>
                </defs>
            </svg>
        )
    },
    {
        name: 'butterfly',
        render: (size) => (
            <svg viewBox="0 0 100 100" className={size}>
                <ellipse cx="35" cy="38" rx="18" ry="22" fill="#9b59b6" transform="rotate(-15 35 38)" />
                <ellipse cx="65" cy="38" rx="18" ry="22" fill="#8e44ad" transform="rotate(15 65 38)" />
                <ellipse cx="38" cy="60" rx="14" ry="18" fill="#e91e63" transform="rotate(-10 38 60)" />
                <ellipse cx="62" cy="60" rx="14" ry="18" fill="#c2185b" transform="rotate(10 62 60)" />
                <ellipse cx="50" cy="50" rx="4" ry="20" fill="#5d4037" />
                <circle cx="44" cy="38" r="3" fill="rgba(255,255,255,0.5)" />
                <circle cx="56" cy="38" r="3" fill="rgba(255,255,255,0.5)" />
                <path d="M48 30 Q44 18 40 15" stroke="#5d4037" strokeWidth="2" fill="none" />
                <path d="M52 30 Q56 18 60 15" stroke="#5d4037" strokeWidth="2" fill="none" />
                <circle cx="40" cy="15" r="2" fill="#5d4037" />
                <circle cx="60" cy="15" r="2" fill="#5d4037" />
            </svg>
        )
    },
    {
        name: 'cupcake',
        render: (size) => (
            <svg viewBox="0 0 100 100" className={size}>
                <path d="M25 55 Q25 30 50 25 Q75 30 75 55Z" fill="#e91e63" />
                <path d="M25 55 Q25 30 50 25 Q75 30 75 55Z" fill="url(#cupcakeShine)" />
                <path d="M22 55 L28 85 L72 85 L78 55Z" fill="#f9a825" />
                <line x1="35" y1="55" x2="37" y2="85" stroke="#f57f17" strokeWidth="1.5" />
                <line x1="50" y1="55" x2="50" y2="85" stroke="#f57f17" strokeWidth="1.5" />
                <line x1="65" y1="55" x2="63" y2="85" stroke="#f57f17" strokeWidth="1.5" />
                <circle cx="40" cy="38" r="3" fill="rgba(255,255,255,0.5)" />
                <circle cx="55" cy="35" r="2" fill="rgba(255,255,255,0.4)" />
                <circle cx="50" cy="45" r="2.5" fill="rgba(255,255,255,0.4)" />
                <circle cx="50" cy="22" r="4" fill="#e74c3c" />
                <defs>
                    <radialGradient id="cupcakeShine" cx="40%" cy="35%">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
                        <stop offset="100%" stopColor="transparent" />
                    </radialGradient>
                </defs>
            </svg>
        )
    },
    {
        name: 'watermelon',
        render: (size) => (
            <svg viewBox="0 0 100 100" className={size}>
                <path d="M15 60 Q50 0 85 60Z" fill="#27ae60" />
                <path d="M20 58 Q50 8 80 58Z" fill="#e74c3c" />
                <circle cx="40" cy="40" r="2" fill="#2c3e50" />
                <circle cx="55" cy="35" r="2" fill="#2c3e50" />
                <circle cx="48" cy="48" r="2" fill="#2c3e50" />
                <circle cx="60" cy="45" r="2" fill="#2c3e50" />
                <circle cx="35" cy="50" r="2" fill="#2c3e50" />
                <circle cx="50" cy="30" r="1.5" fill="#2c3e50" />
            </svg>
        )
    },
];

export default function App() {
    const [gameState, setGameState] = useState('menu'); // menu, playing, gameover
    const [settings, setSettings] = useState({
        p1Name: 'Player 1',
        p2Name: 'Player 2',
        operations: ['+'],
        maxResult: 10,
        timeLimit: 60, // 0 means infinite
        visualMode: 'mix', // 'only-number', 'mix', 'only-objects'
    });

    const [ropePosition, setRopePosition] = useState(0); // -5 (P1 wins) to +5 (P2 wins)
    const [timeLeft, setTimeLeft] = useState(settings.timeLimit);
    const [winner, setWinner] = useState(null);

    const [p1State, setP1State] = useState({ question: null, input: '', feedback: null });
    const [p2State, setP2State] = useState({ question: null, input: '', feedback: null });

    const generateQuestion = useCallback((ops, maxRes, visualMode) => {
        if (ops.length === 0) ops = ['+'];
        const op = ops[Math.floor(Math.random() * ops.length)];
        let num1, num2, answer;

        switch (op) {
            case '+':
                // Ensure num1 and num2 are at least 1, so answer must be at least 2
                const maxAns = Math.max(2, maxRes);
                answer = Math.floor(Math.random() * (maxAns - 1)) + 2; // 2 to maxRes
                num1 = Math.floor(Math.random() * (answer - 1)) + 1; // 1 to answer-1
                num2 = answer - num1;
                break;
            case '-':
                // Ensure num2 and answer are at least 1, so num1 must be at least 2
                const maxNum1 = Math.max(2, maxRes);
                num1 = Math.floor(Math.random() * (maxNum1 - 1)) + 2; // 2 to maxRes
                num2 = Math.floor(Math.random() * (num1 - 1)) + 1; // 1 to num1-1
                answer = num1 - num2;
                break;
            case '×':
                const maxFactor = Math.floor(Math.sqrt(maxRes));
                num1 = Math.floor(Math.random() * maxFactor) + 1;
                num2 = Math.floor(Math.random() * (maxRes / num1)) + 1;
                answer = num1 * num2;
                break;
            case '÷':
                num2 = Math.floor(Math.random() * 10) + 1;
                answer = Math.floor(Math.random() * 10) + 1;
                num1 = num2 * answer;
                if (num1 > maxRes) {
                    num1 = maxRes;
                    num2 = 2;
                    answer = Math.floor(num1 / num2);
                    num1 = answer * num2;
                }
                break;
            default:
                num1 = 1; num2 = 1; answer = 2;
        }

        // Determine display type based on visual mode setting
        let displayType = 'number';
        const canShowObjects = (op === '+' || op === '-') && num1 <= 20 && num2 <= 20;

        if (visualMode === 'only-objects') {
            // Only show objects. For operations that can't display objects (× ÷ or large numbers),
            // fall back to numbers
            displayType = canShowObjects ? 'object' : 'number';
        } else if (visualMode === 'mix') {
            // Mix mode: randomly choose between number and object for eligible questions
            if (canShowObjects) {
                displayType = Math.random() > 0.5 ? 'object' : 'number';
            }
        }
        // 'only-number' mode: displayType stays 'number'

        // Pick a random object type for this question
        const objectType = OBJECT_TYPES[Math.floor(Math.random() * OBJECT_TYPES.length)];

        return { num1, num2, op, answer, displayType, objectType: objectType.name };
    }, []);

    const startGame = () => {
        setRopePosition(0);
        setTimeLeft(settings.timeLimit);
        setWinner(null);
        setP1State({ question: generateQuestion(settings.operations, settings.maxResult, settings.visualMode), input: '', feedback: null });
        setP2State({ question: generateQuestion(settings.operations, settings.maxResult, settings.visualMode), input: '', feedback: null });
        setGameState('playing');
    };

    const endGame = useCallback((finalWinner) => {
        setWinner(finalWinner);
        setGameState('gameover');
    }, []);

    // Timer logic
    useEffect(() => {
        if (gameState !== 'playing' || settings.timeLimit === 0) return;

        if (timeLeft <= 0) {
            if (ropePosition < 0) endGame(settings.p1Name);
            else if (ropePosition > 0) endGame(settings.p2Name);
            else endGame('Tie');
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [gameState, timeLeft, ropePosition, settings, endGame]);

    // Win condition check
    useEffect(() => {
        if (gameState !== 'playing') return;
        if (ropePosition <= -5) endGame(settings.p1Name);
        if (ropePosition >= 5) endGame(settings.p2Name);
    }, [ropePosition, gameState, settings, endGame]);

    const handleInput = (player, val) => {
        const stateSetter = player === 1 ? setP1State : setP2State;

        stateSetter(prev => {
            if (val === 'clear') return { ...prev, input: '' };
            if (val === 'enter') return prev; // Handled separately

            const newInput = prev.input.length < 3 ? prev.input + val : prev.input;
            return { ...prev, input: newInput };
        });
    };

    const submitAnswer = (player) => {
        const currentState = player === 1 ? p1State : p2State;
        const stateSetter = player === 1 ? setP1State : setP2State;
        const isCorrect = parseInt(currentState.input) === currentState.question.answer;

        if (isCorrect) {
            // Pulling rope towards the player who answered right. P1 (left) is -1, P2 (right) is +1
            setRopePosition(prev => prev + (player === 1 ? -1 : 1));
            stateSetter({
                question: generateQuestion(settings.operations, settings.maxResult, settings.visualMode),
                input: '',
                feedback: 'correct'
            });
        } else {
            // Penalty: rope moves away to opponent
            setRopePosition(prev => prev + (player === 1 ? 1 : -1));
            stateSetter(prev => ({ ...prev, input: '', feedback: 'wrong' }));
        }

        setTimeout(() => {
            stateSetter(prev => ({ ...prev, feedback: null }));
        }, 1000);
    };

    const toggleOperation = (op) => {
        setSettings(prev => {
            const ops = prev.operations.includes(op)
                ? prev.operations.filter(o => o !== op)
                : [...prev.operations, op];
            return { ...prev, operations: ops };
        });
    };

    // --- Components ---

    const ObjectVisuals = ({ count, objectTypeName }) => {
        if (count > 20) return null;
        const objectDef = OBJECT_TYPES.find(o => o.name === objectTypeName) || OBJECT_TYPES[0];
        return (
            <div className="flex flex-wrap justify-center gap-0.5 max-w-[80px]">
                {Array.from({ length: count }).map((_, i) => (
                    <div key={i} className="w-5 h-5 drop-shadow-sm">
                        {objectDef.render("w-full h-full")}
                    </div>
                ))}
            </div>
        );
    };

    const PlayerArea = ({ playerNum, state, playerName }) => {
        const isP1 = playerNum === 1;
        const textColor = isP1 ? 'text-blue-600' : 'text-red-600';
        const btnColor = isP1 ? 'bg-blue-500 hover:bg-blue-600' : 'bg-red-500 hover:bg-red-600';
        const borderColor = isP1 ? 'border-blue-200' : 'border-red-200';

        return (
            <div className={`flex-1 flex flex-col justify-between p-2 bg-white/50 backdrop-blur-sm rounded-xl border-2 ${borderColor} m-1`}>
                {/* Name & Feedback */}
                <div className="flex justify-between items-center mb-1">
                    <h2 className={`text-base font-bold ${textColor}`}>{playerName}</h2>
                    {state.feedback === 'correct' && <Check className="text-green-500 w-5 h-5 animate-bounce" />}
                    {state.feedback === 'wrong' && <X className="text-red-500 w-5 h-5 animate-bounce" />}
                </div>

                {/* Question Area */}
                <div className="flex-1 flex flex-col items-center justify-center py-1">
                    {state.question && (
                        <div className="text-center">
                            {state.question.displayType === 'number' ? (
                                <div className="text-2xl font-black text-gray-800 tracking-wide">
                                    {state.question.num1} {state.question.op} {state.question.num2} = ?
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-2 opacity-90">
                                    <ObjectVisuals count={state.question.num1} objectTypeName={state.question.objectType} />
                                    <span className="text-xl text-gray-600 font-bold mx-1">{state.question.op}</span>
                                    <ObjectVisuals count={state.question.num2} objectTypeName={state.question.objectType} />
                                    <span className="text-xl text-gray-600 font-bold mx-1">= ?</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Input & Numpad */}
                <div className="flex flex-col items-center mt-auto">
                    <div className="bg-white rounded-lg shadow-inner w-full max-w-[180px] h-10 flex items-center justify-center mb-2 border-2 border-gray-200">
                        <span className="text-2xl font-bold text-gray-800">
                            {state.input || '_'}
                        </span>
                    </div>

                    <div className="grid grid-cols-3 gap-1 w-full max-w-[180px]">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                            <button
                                key={num}
                                onClick={() => handleInput(playerNum, num.toString())}
                                className="bg-white text-gray-800 text-lg font-bold py-1.5 rounded-lg shadow active:scale-95 transition-transform"
                            >
                                {num}
                            </button>
                        ))}
                        <button
                            onClick={() => handleInput(playerNum, 'clear')}
                            className="bg-gray-200 text-gray-600 flex items-center justify-center rounded-lg shadow active:scale-95 transition-transform py-1.5"
                        >
                            <Delete className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => handleInput(playerNum, '0')}
                            className="bg-white text-gray-800 text-lg font-bold py-1.5 rounded-lg shadow active:scale-95 transition-transform"
                        >
                            0
                        </button>
                        <button
                            onClick={() => submitAnswer(playerNum)}
                            className={`${btnColor} text-white text-base font-bold rounded-lg shadow active:scale-95 transition-transform flex items-center justify-center py-1.5`}
                        >
                            GO
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const RopeGraphic = () => {
        const translatePct = ropePosition * 5;

        return (
            <div className="h-[30vh] w-full relative bg-white border-y-4 border-gray-300 flex items-center justify-center overflow-hidden">
                <div className="absolute w-1 h-full bg-red-500 opacity-20 z-0"></div>

                <img
                    src="https://static.vecteezy.com/system/resources/thumbnails/007/109/567/small/children-playing-tug-of-war-game-free-vector.jpg"
                    alt="Kids playing tug of war"
                    className="absolute top-1/2 left-1/2 max-w-none h-full object-contain z-10"
                    style={{
                        transform: `translate(calc(-50% + ${translatePct}%), -50%)`,
                        transition: 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    }}
                />
            </div>
        );
    };

    // --- Visual Mode Label Helper ---
    const getVisualModeDescription = (mode) => {
        switch (mode) {
            case 'only-number': return 'Questions will only show numbers';
            case 'mix': return 'Questions will mix numbers and object visuals';
            case 'only-objects': return 'Questions will show object visuals when possible';
            default: return '';
        }
    };

    // --- Object Preview for Settings ---
    const ObjectPreview = () => {
        return (
            <div className="flex gap-1 mt-2 flex-wrap justify-center">
                {OBJECT_TYPES.slice(0, 6).map((obj, i) => (
                    <div key={i} className="w-7 h-7" title={obj.name}>
                        {obj.render("w-full h-full")}
                    </div>
                ))}
                <span className="text-xs text-gray-400 self-center ml-1">+{OBJECT_TYPES.length - 6} more</span>
            </div>
        );
    };

    // --- Screens ---

    if (gameState === 'menu') {
        return (
            <div className="w-screen h-screen bg-sky-100 flex items-center justify-center p-4 font-sans">
                <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl flex flex-col items-center">
                    <h1 className="text-3xl font-black text-gray-800 mb-6 flex items-center gap-3">
                        <Trophy className="w-8 h-8 text-yellow-500" />
                        Tug of War Math
                        <Trophy className="w-8 h-8 text-yellow-500" />
                    </h1>

                    <div className="grid grid-cols-2 gap-6 w-full mb-6">
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Left Player</label>
                                <input
                                    type="text"
                                    value={settings.p1Name}
                                    onChange={(e) => setSettings({ ...settings, p1Name: e.target.value })}
                                    className="w-full text-base p-2 border-2 border-blue-200 rounded-lg bg-blue-50 focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Math Operations</label>
                                <div className="flex gap-2">
                                    {OPERATIONS.map(op => (
                                        <button
                                            key={op}
                                            onClick={() => toggleOperation(op)}
                                            className={`w-10 h-10 text-xl font-bold rounded-lg border-2 transition-colors ${settings.operations.includes(op)
                                                ? 'bg-green-500 border-green-600 text-white'
                                                : 'bg-gray-100 border-gray-300 text-gray-400'
                                                }`}
                                        >
                                            {op}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Right Player</label>
                                <input
                                    type="text"
                                    value={settings.p2Name}
                                    onChange={(e) => setSettings({ ...settings, p2Name: e.target.value })}
                                    className="w-full text-base p-2 border-2 border-red-200 rounded-lg bg-red-50 focus:outline-none focus:border-red-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Max Number</label>
                                    <select
                                        value={settings.maxResult}
                                        onChange={(e) => setSettings({ ...settings, maxResult: parseInt(e.target.value) })}
                                        className="w-full text-sm p-2 border-2 border-gray-200 rounded-lg bg-white"
                                    >
                                        <option value={10}>Up to 10</option>
                                        <option value={20}>Up to 20</option>
                                        <option value={50}>Up to 50</option>
                                        <option value={100}>Up to 100</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Timer (Seconds)</label>
                                    <select
                                        value={settings.timeLimit}
                                        onChange={(e) => setSettings({ ...settings, timeLimit: parseInt(e.target.value) })}
                                        className="w-full text-sm p-2 border-2 border-gray-200 rounded-lg bg-white"
                                    >
                                        <option value={30}>30s</option>
                                        <option value={60}>60s</option>
                                        <option value={120}>120s</option>
                                        <option value={0}>No Timer</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Visual Mode Dropdown */}
                    <div className="w-full bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border-2 border-purple-100 mb-6">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-bold text-gray-700 mb-1">
                                    🎨 Question Display Mode
                                </label>
                                <select
                                    value={settings.visualMode}
                                    onChange={(e) => setSettings({ ...settings, visualMode: e.target.value })}
                                    className="w-full text-sm p-2.5 border-2 border-purple-200 rounded-lg bg-white focus:outline-none focus:border-purple-500 font-semibold text-gray-700"
                                >
                                    <option value="only-number">📊 Only Numbers</option>
                                    <option value="mix">🔀 Mix (Numbers + Objects)</option>
                                    <option value="only-objects">🎯 Only Objects</option>
                                </select>
                                <p className="text-xs text-gray-500 mt-1.5 italic">
                                    {getVisualModeDescription(settings.visualMode)}
                                </p>
                            </div>
                        </div>
                        {settings.visualMode !== 'only-number' && (
                            <div className="mt-3 pt-3 border-t border-purple-100">
                                <p className="text-xs text-gray-500 text-center mb-1">Available objects:</p>
                                <ObjectPreview />
                            </div>
                        )}
                    </div>

                    <button
                        onClick={startGame}
                        disabled={settings.operations.length === 0}
                        className="bg-green-500 hover:bg-green-600 text-white text-2xl font-bold py-3 px-10 rounded-full shadow-xl transition-transform active:scale-95 flex items-center gap-3 disabled:opacity-50"
                    >
                        <Play className="w-7 h-7 fill-current" />
                        START GAME
                    </button>
                </div>
            </div>
        );
    }

    if (gameState === 'playing') {
        return (
            <div className="w-screen h-screen flex flex-col font-sans overflow-hidden bg-sky-50 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-100 to-sky-200">
                {/* Top Bar */}
                <div className="h-10 bg-gray-800 flex items-center justify-between px-4 shadow-lg z-30">
                    <button
                        onClick={() => setGameState('menu')}
                        className="text-white hover:text-gray-300 p-1"
                    >
                        <Settings className="w-5 h-5" />
                    </button>

                    <div className="text-xl font-mono font-bold text-yellow-400 tracking-wider">
                        {settings.timeLimit > 0 ? (
                            `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`
                        ) : '∞'}
                    </div>

                    <div className="w-5"></div>
                </div>

                {/* The Centered Graphic Area */}
                <RopeGraphic />

                {/* Players Area */}
                <div className="flex-1 flex justify-center items-stretch p-1 gap-1">
                    <PlayerArea playerNum={1} state={p1State} playerName={settings.p1Name} />
                    <PlayerArea playerNum={2} state={p2State} playerName={settings.p2Name} />
                </div>
            </div>
        );
    }

    if (gameState === 'gameover') {
        return (
            <div className="w-screen h-screen bg-sky-100 flex items-center justify-center p-4 font-sans">
                <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-lg flex flex-col items-center text-center">
                    <Trophy className="w-20 h-20 text-yellow-500 mb-4 animate-bounce" />

                    <h1 className="text-3xl font-black text-gray-800 mb-3">
                        {winner === 'Tie' ? "It's a Tie!" : `${winner} Wins!`}
                    </h1>

                    <p className="text-lg text-gray-600 mb-6 font-bold">
                        Great job pulling the rope!
                    </p>

                    <div className="flex gap-4">
                        <button
                            onClick={() => setGameState('menu')}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-xl font-bold py-3 px-6 rounded-xl shadow-lg transition-transform active:scale-95 flex items-center gap-2"
                        >
                            <Settings className="w-5 h-5" />
                            Menu
                        </button>
                        <button
                            onClick={startGame}
                            className="bg-green-500 hover:bg-green-600 text-white text-xl font-bold py-3 px-6 rounded-xl shadow-lg transition-transform active:scale-95 flex items-center gap-2"
                        >
                            <RotateCcw className="w-5 h-5" />
                            Play Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
