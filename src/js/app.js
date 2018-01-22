
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
    .then(function(registration) {
      console.log('Registration successful, scope is:', registration.scope);
    })
    .catch(function(error) {
      console.log('Service worker registration failed, error:', error);
    });
}

var lastValue = 0;
var coins = [];

    document.getElementsByName('options').forEach(function (value, index, lst) {

        value.addEventListener('click', function(event) {
            console.log('from options -> click');
            UpdatePrice(event.path[0]);
    });    
    
    function btnRefreshClick(event) {
      
        console.log('from btnRefresh');
        console.log(event);

        var radios = document.getElementsByName('options');

        for (var i = 0; i < radios.length; i++)
        {
            if (radios[i].checked) {
                UpdatePrice(radios[i]);
                break;
            }
        }        
    }

    var newBtnRefreshHandle = function(event) { btnRefreshClick(event); };

    document.getElementById('btnRefresh').addEventListener('click', newBtnRefreshHandle, false);

    var bitcoinPrice = document.getElementById('bitcoinPrice');

    bitcoinPrice.addEventListener('keyup', function (event) {

        var currencyLbl = document.getElementsByClassName('is-checked')[0];
        var ckBox = currencyLbl.children.namedItem('options');

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

function fetchCoins() {
    console.log('fetching coins...');
    fetch('https://api.coindesk.com/v1/bpi/currentprice/BRL.json')
        .then(function (response) {
            return response.json();
        })
        .then(function (res) {
            coins = [];
            for (coinProperty in res.bpi) {
                res.bpi[coinProperty]['updatedISO'] = res.time.updatedISO;
                coins.push(res.bpi[coinProperty]);
            }
        })
        .catch(function (err) {
            console.log('status', err);
            var notification = document.querySelector('.mdl-js-snackbar');
            notification.MaterialSnackbar.showSnackbar({ message: 'Falha na conexão com a internet!' });
        });
}

function UpdatePrice(ckBox) {
    fetchCoins();

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
        '     ' + coin.code +
        '     ' + parseFloat(coin.rate_float * lastValue).toLocaleString();

    if (coin.description) {
        html = html + ' <br><br><br><span class="text-small"> (' + coin.description + ') </span>';
    }

    if (coin.updatedISO) {
        var updateDt = new Date(coin.updatedISO);
        html = html + '  <br><br><span class="text-small"> Atualizado em ' + updateDt.toLocaleTimeString() + '</span>';
    }

    html = html + '</div>';
    newCart.innerHTML = html;
    carts.appendChild(newCart);
}
