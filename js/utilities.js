function rectCollision({ rect1, rect2 }) {
  return (
    rect1.attackBox.position.x + rect1.attackBox.width >=
      rect2.position.x &&
    rect1.attackBox.position.x <= rect2.position.x + rect2.width &&
    rect1.attackBox.position.y + rect1.attackBox.height >=
      rect2.position.y &&
    rect1.attackBox.position.y <= rect2.position.y + rect2.height
  );
}

function determineWinner({ player, enemy, timerId }) {
  clearTimeout(timerId);
  let result = document.querySelector(".result");
  document.querySelector(".result").style.display = "Flex";
  if (player.health === enemy.health) {
    result.textContent = "Tie";
  } else if (player.health > enemy.health) {
    result.textContent = "Player 1 Wins";
  } else if (player.health < enemy.health) {
    result.textContent = "Player 2 Wins";
  }
}
