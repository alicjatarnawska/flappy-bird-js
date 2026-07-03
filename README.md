# Flappy Bird JS

Autorska wersja gry inspirowanej Flappy Birdem stworzona w czystym JavaScript z wykorzystaniem HTML5 Canvas API.

Projekt został wykonany bez użycia frameworków ani silników gier — cała logika gry została zaimplementowana samodzielnie.

## Preview

## Screenshot

![Game Screenshot](images/screenshot.png)


---

## Technologies

* HTML5
* CSS3
* JavaScript
* Canvas API
* localStorage

---

## Features

* Sterowanie ptakiem przy użyciu klawisza SPACE
* System fizyki oparty o grawitację i velocity
* Proceduralne generowanie przeszkód
* Dynamiczny poziom trudności
* System przeciwników
* Collision detection
* Efekty dźwiękowe
* Zapisywanie najlepszego wyniku przy użyciu localStorage
* System restartu gry

---

## Enemy System

### Normal Enemy

* pojawia się od wyższego poziomu,
* porusza się szybciej niż standardowe przeszkody,
* powoduje zakończenie gry po kolizji.

### Fast Enemy

* bardzo szybki przeciwnik,
* posiada system ostrzegania przed pojawieniem się,
* zwiększa poziom trudności rozgrywki.

---

## Project Structure

```text
index.html
style.css
script.js
assets/
```

---

## Main Functions

### gameLoop()

Obsługuje główną pętlę gry:

* aktualizację logiki,
* renderowanie,
* animacje.

### createPipe()

Tworzy nowe przeszkody.

### updatePipes()

Aktualizuje przeszkody i sprawdza kolizje.

### createEnemy()

Tworzy przeciwników.

### resetGame()

Resetuje stan gry po przegranej.

---

## What I Learned

Projekt pozwolił mi rozwinąć umiejętności związane z:

* JavaScript,
* programowaniem logiki gry,
* Canvas API,
* animacjami,
* collision detection,
* zarządzaniem stanem aplikacji,
* obsługą zdarzeń.

---

## Author

Alicja Tarnawska
