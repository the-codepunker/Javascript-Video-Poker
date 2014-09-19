function colorPicker()
{
  this.dealCardForRedorBlack = dealCardForRedorBlack;
  this.askIfRedorBlack = askIfRedorBlack;

  function dealCardForRedorBlack()
  {
    guessedCards++;
    hand.cards = [];
    hand.addCard(deck.deal());

    card = hand.cards[0];
    jQuery('#rorb').prepend(card.create());
    return card;
  }

  function askIfRedorBlack()
  {
    jQuery('#rorb').append(jQuery('<div class="card tobechanged">'));
  }

}

function Card(rank, suit, positionH, positionV)
{
  this.rank = rank;
  this.suit = suit;
  this.positionV = positionV;
  this.positionH = positionH;

  this.toString   = cardToString;
  this.create = cardCreate;

  function cardToString()
  {
    var rank, suit;
    switch (this.rank) {
      case "A" :
        rank = "Ace";
        break;
      case "2" :
        rank = "Two";
        break;
      case "3" :
        rank = "Three";
        break;
      case "4" :
        rank = "Four";
        break;
      case "5" :
        rank = "Five";
        break;
      case "6" :
        rank = "Six";
        break;
      case "7" :
        rank = "Seven";
        break;
      case "8" :
        rank = "Eight";
        break;
      case "9" :
        rank = "Nine";
        break;
      case "10" :
        rank = "Ten";
        break;
      case "J" :
        rank = "Jack";
        break;
      case "Q" :
        rank = "Queen";
        break;
      case "K" :
        rank = "King";
        break;
      default :
        rank = null;
        break;
    }

    switch (this.suit) {
      case "C" :
        suit = "Clubs";
        break;
      case "D" :
        suit = "Diamonds";
        break;
      case "H" :
        suit = "Hearts";
        break;
      case "S" :
        suit = "Spades";
        break;
      default :
        suit = null;
        break;
    }

    if (rank === null || suit === null)
      return "";

    return rank + " of " + suit;
  }

  function cardCreate() {
    var card;
    card = jQuery('<div class="card" data-card="'+this.toString()+'">').css('background-position', this.positionH + 'px ' + this.positionV + 'px');
    return card;
  }
}

function Stack()
{
  this.cards = [];

  this.makeDeck  = stackMakeDeck;
  this.shuffle   = stackShuffle;
  this.deal      = stackDeal;
  this.draw      = stackDraw;
  this.addCard   = stackAddCard;
  this.combine   = stackCombine;
  this.cardCount = stackCardCount;

  function stackMakeDeck(n)
  {
    var ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    var suits = ["C", "D", "H", "S"];
    var vPosIncrement = 142.7;
    var hPosIncrement = 98.4;
    var i, j, k;
    var m;

    m = ranks.length * suits.length;
    this.cards = new Array(n * m);
    for (i = 0; i < n; i++)
      for (j = 0; j < suits.length; j++)
        for (k = 0; k < ranks.length; k++)
          this.cards[i * m + j * ranks.length + k] = new Card(ranks[k], suits[j], k*hPosIncrement*-1, j*vPosIncrement*-1);
  }

  function stackDeal()
  {
    if (this.cards.length > 0)
      return this.cards.shift();
    else
      return null;
  }

  function stackDraw(n)
  {
    var card;
    if (n >= 0 && n < this.cards.length) {
      card = this.cards[n];
      this.cards.splice(n, 1);
    }
    else
      card = null;

    return card;
  }

  function stackCardCount()
  {
    return this.cards.length;
  }

  function stackAddCard(card)
  {
    this.cards.push(card);
  }

  function stackShuffle(n)
  {
    var i, j, k;
    var temp;
    for (i = 0; i < n; i++)
      for (j = 0; j < this.cards.length; j++) {
        k = Math.floor(Math.random() * this.cards.length);
        temp = this.cards[j];
        this.cards[j] = this.cards[k];
        this.cards[k] = temp;
      }
  }

  function stackCombine(stack)
  {
    this.cards = this.cards.concat(stack.cards);
    stack.cards = [];
  }
}

function handEvaluations()
{
  var hands=["4 of a Kind", "Straight Flush", "Straight", "Flush", "High Card", "1 Pair", "2 Pairs", "Royal Flush", "3 of a Kind", "Full House"];
  return hands;
}

function defineMultipliers(hand)
{
  var m;
  switch (hand) {
    case "Hand: High Card" :
      m = 1;
      break;
    case "Hand: 1 Pair" :
      m = 2;
      break;
    case "Hand: 2 Pairs" :
      m = 3;
      break;
    case "Hand: 3 of a Kind" :
      m = 4;
      break;
    case "Hand: Straight" :
      m = 5;
      break;
    case "Hand: Flush" :
      m = 6;
      break;
    case "Hand: Full House" :
      m = 7;
      break;
    case "Hand: 4 of a Kind" :
      m = 8;
      break;
    case ("Hand: Straight Flush") :
    case ("Hand: Royal Flush") :
      m = 9;
      break;
    default :
      m = 0;
      break;
  }
  return m;
}

function prepareHandForEval(hand)
{
  var ranks = { "A":14, "K":13, "Q":12, "J":11, "10":10, "9":9, "8":8, "7":7, "6":6, "5":5, "4":4, "3":3, "2":2 };
  var suits = { "S":1, "C":2, "H":4, "D":8 };
  var i;
  var cs = [];
  var ss = [];
  for(i in hand)
  {
    cs.push(ranks[hand[i].rank]);
    ss.push(suits[hand[i].suit]);
  }
  return rankPokerHand(cs,ss);
}

//Calculates the Rank of a 5 card Poker hand using bit manipulations.
function rankPokerHand(cs, ss) {
  var hands, v, i, o, s = 1<<cs[0]|1<<cs[1]|1<<cs[2]|1<<cs[3]|1<<cs[4];
  hands = handEvaluations();
  for (i=-1, v=o=0; i<5; i++, o=Math.pow(2,cs[i]*4)) {v += o*((v/o&15)+1);}
  v = v % 15 - ((s/(s&-s) == 31) || (s == 0x403c) ? 3 : 1);
  v -= (ss[0] == (ss[1]|ss[2]|ss[3]|ss[4])) * ((s == 0x7c00) ? -5 : 1);
  return "Hand: " + hands[v] + (s == 0x403c?" (Ace low)":"");
}


