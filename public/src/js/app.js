
var lastValue = 0;
var coins = [];
window.addEventListener('load', function (event) {

    fetch('https://api.coindesk.com/v1/bpi/currentprice/BRL.json')
        .then(function (response) {
            return response.json();
        })
        .then(function (res) {

            for(coinProperty in res.bpi){
                coins.push(res.bpi[coinProperty]);
            }
            
        })
        .catch(function (err) {
            console.log(err);
        });

        var bitcoinPrice = document.getElementById("bitcoinPrice");

        bitcoinPrice.addEventListener('keyup', function(event) {
            console.log(event);
            if (event.key in ['0','1','2','3','4','5','6','7','8','9','.',','] || event.key == 'Backspace') {
                if (parseFloat(bitcoinPrice.value) !== NaN) {
                    lastValue = parseFloat(bitcoinPrice.value);

                    for(var i = 0; i < coins.length; i++) {
                       convertToCurrency(coins[i]);
                    }
                }
            }        
        })
});

function convertToCurrency(coin) {
    var carts = document.getElementById('cards');
    
    for (var i = 0; i < carts.childNodes.length; i++) {
       carts.removeChild(carts.childNodes[i]);
    }

    var newCart = document.createElement('div');
    newCart.innerHTML =
        '<div class="center-content">' +
        '     <h2>' + coin.code +
        '         ' + parseFloat(coin.rate_float * lastValue).toFixed(2) +
        '     </h2>' +
        '  <span> (' + coin.description + ') </span>' +
        '</div>';
        carts.appendChild(newCart);    
}