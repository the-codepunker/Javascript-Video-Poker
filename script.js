var cardsHaveBeenChanged = true;
var handisFinished = false;
var deck, hand, redorblack, handwinnings=0, guessedCards=0, credits=10;

function startOver()
{
  jQuery('#result span.result, #result span.winnings').html('');
  jQuery('#dealCards').text('Deal').removeAttr('style');
  guessedCards = 0;
  credits = credits + handwinnings;
  refreshCredits(credits);
  handisFinished = false;
  handwinnings = 0;
  jQuery('.card').remove();
  credits --;
  refreshCredits(credits);
  deck = new Stack();
  hand = new Stack();

  deck.makeDeck(1);
  deck.shuffle(1);
  dealCards(5);
}

function dealCards(howManyToDeal)
{
  var i;
  for (i = 0; i < howManyToDeal; i++)
    hand.addCard(deck.deal());

  for(var card in hand.cards)
  {
    card = hand.cards[card];
    jQuery('#dealtcards').append(card.create());
  }

  if(cardsHaveBeenChanged)
    cardsHaveBeenChanged = false;
  else
  {
    putResultInDom(prepareHandForEval(hand.cards)); /*Prepare hand for eval calls eval*/
    cardsHaveBeenChanged = true;
    redorblack = new colorPicker();
    redorblack.askIfRedorBlack();
    jQuery('#dealCards').text('Collect').css('background', 'rgb(95, 160, 105)');
  }
  return true;
}

function refreshCredits(credits)
{
  jQuery('#credits span').text(credits);
}

function putResultInDom(result)
{
  var multiplier;
  multiplier = defineMultipliers(result);
  jQuery('#result span.result').text(result);
  handwinnings = multiplier;
  jQuery('#result span.winnings').text('Current winnings: ' + multiplier);
}

jQuery('#dealCards').on({
  'click': function(e){
    e.preventDefault();
    if(cardsHaveBeenChanged)
    {
      if(credits===0)
      {
        jQuery('#result span.winnings').html('<span style="color:rgb(245, 195, 195);">Your credit is depleted! Refresh the page to start over.</span>');
        return;
      }
      startOver();
    }
    else
      alert('Select the cards you want changed and click change');
  }
});

jQuery('#dealtcards').on('click', '.card', function(e){
    if(!cardsHaveBeenChanged)
      jQuery(this).toggleClass('tobechanged');
  }
);

jQuery('#changeCards').on({
  'click': function(e){
    e.preventDefault();
    var card;
    var handclone = [];
    if(!cardsHaveBeenChanged)
    {
      for(card in hand.cards)
      {
        if(jQuery('.tobechanged[data-card="' + hand.cards[card].toString() + '"]').length===0)
          handclone.push(hand.cards[card]); //push what we want to keep into a new array
      }

      hand.cards = handclone; //overwrite the old hand with a new one containing only what we want to keep
      var howManyToChange = jQuery('.tobechanged').length;
      jQuery('.card').remove();
      dealCards(howManyToChange);
    }
  }
});

jQuery('.color').on({
  'click': function(e) {
    e.preventDefault();
    if(handisFinished)
      return false;
    var chosencolor, card, actualcolor;
    chosencolor = jQuery(this).attr('id');
    card = redorblack.dealCardForRedorBlack();
    switch (card.suit) {
      case ("C") :
      case ("S") :
        actualcolor = "black";
        break;
      default :
        actualcolor = "red";
        break;
    }

    if(chosencolor==actualcolor)
    {
      handwinnings = handwinnings*2;
      if(guessedCards===3)
      {
        jQuery('#result span.result').html('');
        jQuery('#result span.winnings').html('<span style="color: rgb(185, 219, 185);">Congratulations! You won: ' + handwinnings + ' credits!</span>');
        cardsHaveBeenChanged = true; //if they press change, deal very, very fast ... this remains somewhere in the queue so I just reset it here.
        handisFinished = true; 
        jQuery('#dealCards').text('Deal').removeAttr('style');
      }
      else
        jQuery('#result span.winnings').text('Current winnings: ' + handwinnings);
    }
    else
    {
      if(!cardsHaveBeenChanged)
        cardsHaveBeenChanged = true; //if they press change, deal very, very fast ... this remains somewhere in the queue so I just reset it here.
      handisFinished = true;
      handwinnings = 0;
      jQuery('#result span.result').html('');
      jQuery('#result span.winnings').html('<span style="color:rgb(245, 195, 195);">BUSTED!</span>');
      jQuery('#dealCards').text('Deal').removeAttr('style');
    }
    return;
  }
});

jQuery('.dismisshelp').click(function(e){ e.preventDefault(); jQuery('.help').hide(); startOver(); });