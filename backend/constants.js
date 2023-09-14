FRAME_RATE=100;
GRID_X=100;
GRID_Y=60;
WIN_SCORE = 5;
SPEEN_INCREMENT_FACTOR = 0.04;

ICE_SERVERS = {
  iceServers: [
    {
      urls: [
        "stun:stun1.l.google.com:19302",
        "stun:stun2.l.google.com:19302",
      ],
    },
  ],
};

module.exports = {
    FRAME_RATE,
    GRID_X,
    GRID_Y,
    WIN_SCORE,
    SPEEN_INCREMENT_FACTOR,
    ICE_SERVERS,
}