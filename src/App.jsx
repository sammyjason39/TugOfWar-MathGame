import React, { useState, useEffect, useCallback } from 'react';
import { Settings, Play, RotateCcw, Trophy, Check, X, Delete } from 'lucide-react';

const OPERATIONS = ['+', '-', '×', '÷'];

export default function App() {
    const [gameState, setGameState] = useState('menu'); // menu, playing, gameover
    const [settings, setSettings] = useState({
        p1Name: 'Player 1',
        p2Name: 'Player 2',
        operations: ['+'],
        maxResult: 10,
        timeLimit: 60, // 0 means infinite
        useObjects: true,
    });

    const [ropePosition, setRopePosition] = useState(0); // -5 (P1 wins) to +5 (P2 wins)
    const [timeLeft, setTimeLeft] = useState(settings.timeLimit);
    const [winner, setWinner] = useState(null);

    const [p1State, setP1State] = useState({ question: null, input: '', feedback: null });
    const [p2State, setP2State] = useState({ question: null, input: '', feedback: null });

    const generateQuestion = useCallback((ops, maxRes, useObj) => {
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

        // Randomize displaying numbers vs objects if setting is ON and problem is simple addition/subtraction
        let displayType = 'number';
        if (useObj && (op === '+' || op === '-') && num1 <= 20 && num2 <= 20) {
            displayType = Math.random() > 0.5 ? 'object' : 'number';
        }

        return { num1, num2, op, answer, displayType };
    }, []);

    const startGame = () => {
        setRopePosition(0);
        setTimeLeft(settings.timeLimit);
        setWinner(null);
        setP1State({ question: generateQuestion(settings.operations, settings.maxResult, settings.useObjects), input: '', feedback: null });
        setP2State({ question: generateQuestion(settings.operations, settings.maxResult, settings.useObjects), input: '', feedback: null });
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
                question: generateQuestion(settings.operations, settings.maxResult, settings.useObjects),
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

    const AppleVisuals = ({ count }) => {
        if (count > 20) return null;
        return (
            <div className="flex flex-wrap justify-center gap-0.5 max-w-[80px]">
                {Array.from({ length: count }).map((_, i) => (
                    <svg key={i} viewBox="0 0 24 24" fill="#ef4444" className="w-4 h-4 drop-shadow-md">
                        <path d="M12 2C7.5 2 4 5.5 4 10c0 4.5 4 8 8 12 4-4 8-7.5 8-12 0-4.5-3.5-8-8-8zm-1-2c0 2 2 3 2 3s-1-2-1-3h-1z" />
                    </svg>
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
                                    <AppleVisuals count={state.question.num1} />
                                    <span className="text-xl text-gray-600 font-bold mx-1">{state.question.op}</span>
                                    <AppleVisuals count={state.question.num2} />
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

                    <div className="w-full flex items-center justify-center gap-3 mb-6 bg-gray-50 p-3 rounded-xl border-2 border-gray-100">
                        <span className="text-sm font-bold text-gray-700">Show Object Visuals (Apples)?</span>
                        <button
                            onClick={() => setSettings({ ...settings, useObjects: !settings.useObjects })}
                            className={`w-12 h-6 rounded-full relative transition-colors ${settings.useObjects ? 'bg-green-500' : 'bg-gray-300'}`}
                        >
                            <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all`} style={{ left: settings.useObjects ? '1.625rem' : '0.125rem' }}></div>
                        </button>
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
