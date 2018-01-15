
var lastValue = 0;
var coins = [];
window.addEventListener('load', function (event) {

    fetch('https://api.coindesk.com/v1/bpi/currentprice/BRL.json')
        .then(function (response) {
            return response.json();
        })
        .then(function (res) {
            console.log(res);
            for (coinProperty in res.bpi) {
                res.bpi[coinProperty]['updatedISO'] = res.time.updatedISO;
                coins.push(res.bpi[coinProperty]);
            }

        })
        .catch(function (err) {
            console.log(err);
        });

    document.getElementsByName('options').forEach(function (value, index, lst){
        value.onclick = function(event) {
            UpdatePrice(event.path[0]);
        }
    });

    var bitcoinPrice = document.getElementById('bitcoinPrice');

    bitcoinPrice.addEventListener('keyup', function (event) {
        var currencyLbl = document.getElementsByClassName('is-checked')[0];
        var ckBox = currencyLbl.children.namedItem('options');
        console.log(ckBox);

        if (event.key in ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', ','] || event.key == 'Backspace') {
            if (bitcoinPrice.value && parseFloat(bitcoinPrice.value) !== NaN) {
                lastValue = parseFloat(bitcoinPrice.value);
            } else {
                lastValue = 0;
            }
            UpdatePrice(ckBox);
        }
    })
});

function UpdatePrice(ckBox) {
    for (var i = 0; i < coins.length; i++) {
        if (ckBox.value === coins[i].code) {
            convertToCurrency(coins[i]);
        }
    }
}

function convertToCurrency(coin) {
    var carts = document.getElementById('cards');

    for (var i = 0; i < carts.childNodes.length; i++) {
        carts.removeChild(carts.childNodes[i]);
    }

    var newCart = document.createElement('div');
    var html =
        '<div class="center-content">' +
        '     <h1>' + coin.code +
        '         ' + parseFloat(coin.rate_float * lastValue).toLocaleString() +
        '     </h1>';

    if (coin.description) {
        html = html + '  <span> (' + coin.description + ') </span>';
    }

    if (coin.updatedISO) {
        var updateDt = new Date(coin.updatedISO);
        html = html + '  <br><span> Atualizado em ' + updateDt.toLocaleTimeString() + '</span>';
    }

    html = html + '</div>';
    newCart.innerHTML = html;
    carts.appendChild(newCart);
}