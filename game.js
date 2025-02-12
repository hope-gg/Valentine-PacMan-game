<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Valentine's Love Catch 💖</title>
    <link href="https://fonts.googleapis.com/css2?family=Luckiest+Guy&family=Dancing+Script:wght@600&display=swap" rel="stylesheet">
    <style>
        body {
            margin: 0;
            font-family: 'Luckiest Guy', cursive;
            background: linear-gradient(to bottom, #FF4F79, #FF1744);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            overflow: hidden;
            text-align: center;
        }
        #gameCanvas {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 15px;
            box-shadow: 0px 10px 18px rgba(0, 0, 0, 0.25);
            max-width: 95%;
        }
        h1 {
            font-family: 'Dancing Script', cursive;
            font-size: 50px;
            color: #fff;
            text-shadow: 3px 3px 8px rgba(0, 0, 0, 0.3);
        }
        .button {
            background: #FF1744;
            color: white;
            font-size: 22px;
            padding: 14px 38px;
            border: none;
            cursor: pointer;
            border-radius: 50px;
            margin-top: 20px;
            font-family: 'Luckiest Guy', cursive;
            box-shadow: 0px 6px 14px rgba(0, 0, 0, 0.3);
            transition: transform 0.2s ease, background 0.3s ease;
        }
        .button:hover {
            background: #D50000;
            transform: scale(1.08);
        }
        #message-container {
            font-size: 26px;
            font-family: 'Dancing Script', cursive;
            color: #FF1744;
            font-weight: bold;
            margin-top: 20px;
            padding: 18px;
            background: rgba(255, 250, 240, 0.95);
            border-radius: 12px;
            box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2);
            width: 80%;
            max-width: 500px;
        }
    </style>
</head>
<body>
    <h1>Catch the Hearts! 💘</h1>
    <canvas id="gameCanvas"></canvas>
    <button class="button" id="startButton">Start the Game</button>
    <div id="message-container" style="display: none;"></div>
    <script src="game.js"></script>
</body>
</html>
