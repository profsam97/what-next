"use client";

import { Howl } from "howler";

let correctSound: Howl | null = null;
let wrongSound: Howl | null = null;
let tickSound: Howl | null = null;
let gameOverSound: Howl | null = null;

function getCorrectSound() {
  if (!correctSound) {
    correctSound = new Howl({
      src: ["/assets/sounds/correct.mp3"],
      volume: 0.5,
    });
  }
  return correctSound;
}

function getWrongSound() {
  if (!wrongSound) {
    wrongSound = new Howl({
      src: ["/assets/sounds/wrong.mp3"],
      volume: 0.4,
    });
  }
  return wrongSound;
}

function getTickSound() {
  if (!tickSound) {
    tickSound = new Howl({
      src: ["/assets/sounds/tick.mp3"],
      volume: 0.2,
    });
  }
  return tickSound;
}

function getGameOverSound() {
  if (!gameOverSound) {
    gameOverSound = new Howl({
      src: ["/assets/sounds/gameover.mp3"],
      volume: 0.5,
    });
  }
  return gameOverSound;
}

export function playCorrect() {
  try { getCorrectSound().play(); } catch {}
}

export function playWrong() {
  try { getWrongSound().play(); } catch {}
}

export function playTick() {
  try { getTickSound().play(); } catch {}
}

export function playGameOver() {
  try { getGameOverSound().play(); } catch {}
}
