var contract = require("@truffle/contract");

const States = [
  "Harvested",  // 0
  "Processed",  // 1
  "Packed",     // 2
  "ForSale",    // 3
  "Sold",       // 4
  "Shipped",    // 5
  "Received",   // 6
  "Purchased"   // 7
 ];

App = {
    web3Provider: null,
    contracts: {},
    emptyAddress: "0x0000000000000000000000000000000000000000",
    sku: 0,
    upc: 0,
    metamaskAccountID: "0x0000000000000000000000000000000000000000",
    ownerID: "0x0000000000000000000000000000000000000000",
    originFarmerID: "0x0000000000000000000000000000000000000000",
    originFarmName: null,
    originFarmInformation: null,
    originFarmLatitude: null,
    originFarmLongitude: null,
    productNotes: null,
    productPrice: 0,
    distributorID: "0x0000000000000000000000000000000000000000",
    retailerID: "0x0000000000000000000000000000000000000000",
    consumerID: "0x0000000000000000000000000000000000000000",

    init: async function () {
        App.readForm();
        setInterval(App.getMetaskAccountID, 1000);
        /// Setup access to blockchain
        return await App.initWeb3();
    },

    readForm: function () {
        const upc =  $("#upc").val();
        if (upc !== App.upc) {
            $("#ftc-events").html("")
        }
        App.upc = upc;
        App.sku = $("#sku").val();
        App.ownerID = $("#ownerID").val();
        App.originFarmerID = $("#originFarmerID").val();
        App.originFarmName = $("#originFarmName").val();
        App.originFarmInformation = $("#originFarmInformation").val();
        App.originFarmLatitude = $("#originFarmLatitude").val();
        App.originFarmLongitude = $("#originFarmLongitude").val();
        App.productNotes = $("#productNotes").val();
        App.productPrice = $("#productPrice").val();
        App.distributorID = $("#distributorID").val();
        App.retailerID = $("#retailerID").val();
        App.consumerID = $("#consumerID").val();

        console.log(
            App.sku,
            App.upc,
            App.ownerID, 
            App.originFarmerID, 
            App.originFarmName, 
            App.originFarmInformation, 
            App.originFarmLatitude, 
            App.originFarmLongitude, 
            App.productNotes, 
            App.productPrice, 
            App.distributorID, 
            App.retailerID, 
            App.consumerID
        );
    },

    initWeb3: async function () {
        /// Find or Inject Web3 Provider
        /// Modern dapp browsers...
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
            try {
                // Request account access
                await window.ethereum.enable();
            } catch (error) {
                // User denied account access...
                console.error("User denied account access")
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = window.web3.currentProvider;
        }
        // If no injected web3 instance is detected, fall back to Ganache
        else {
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        }

        App.getMetaskAccountID();

        return App.initSupplyChain();
    },

    getMetaskAccountID: function () {
        web3 = new Web3(App.web3Provider);

        // Retrieving accounts
        web3.eth.getAccounts(function(err, res) {
            if (err) {
                console.log('Error:',err);
                return;
            }
            App.metamaskAccountID = res[0];
            $("#ftc-account").html("<div>Address: " + App.metamaskAccountID + "</div>");
            let role = "";
            switch (App.metamaskAccountID.toUpperCase()) {
                case App.originFarmerID.toUpperCase():
                    role = "Farmer";
                    break;
                case App.distributorID.toUpperCase():
                    role = "Distributor";
                    break;
                case App.retailerID.toUpperCase():
                    role = "Retailer";
                    break;
                case App.consumerID.toUpperCase():
                    role = "Consumer";
                    break;
                        
            }

            $("#farmer-role").html(`<h2>Farmer ${role === 'Farmer' ? '(current role)' : ''}`);
            $("#distributor-role").html(`<h2>Distributor ${role === 'Distributor' ? '(current role)' : ''}`);
            $("#retailer-role").html(`<h2>Retailer ${role === 'Retailer' ? '(current role)' : ''}`);
            $("#consumer-role").html(`<h2>Consumer ${role === 'Consumer' ? '(current role)' : ''}`);
            $("#ftc-account").append("<div>Role: " + role + "</div>");
        })
    },

    initSupplyChain: function () {
        /// Source the truffle compiled smart contracts
        var jsonSupplyChain='./build/contracts/SupplyChain.json';
        console.log("initSupplyChain")
        
        /// JSONfy the smart contracts
        $.getJSON(jsonSupplyChain, function(data) {
            var SupplyChainArtifact = data;
            App.contracts.SupplyChain = TruffleContract(SupplyChainArtifact);
            App.contracts.SupplyChain.setProvider(App.web3Provider);
            
            App.updateProductInfo();
            App.fetchEvents();

        });

        return App.bindEvents();
    },

    bindEvents: function() {
        $(document).on('click', App.handleButtonClick);
    },

    handleButtonClick: async function(event) {
        event.preventDefault();

        App.getMetaskAccountID();

        App.readForm()

        var processId = parseInt($(event.target).data('id'));
        switch(processId) {
            case 1:
                return await App.harvestItem(event);
                break;
            case 2:
                return await App.processItem(event);
                break;
            case 3:
                return await App.packItem(event);
                break;
            case 4:
                return await App.sellItem(event);
                break;
            case 5:
                return await App.buyItem(event);
                break;
            case 6:
                return await App.shipItem(event);
                break;
            case 7:
                return await App.receiveItem(event);
                break;
            case 8:
                return await App.purchaseItem(event);
                break;
            case 9:
                return await App.updateProductInfo(event);
                break;
            case 10:
                return await App.fetchItemBufferTwo(event);
                break;
            case 11:
                return await App.registerAsFarmer(event);
                break;
            case 12:
                return await App.registerAsDistributor(event);
                break;
            case 13:
                return await App.registerAsRetailer(event);
                break;
            case 14:
                return await App.registerAsConsumer(event);
                break;
            case 15:
                return await App.registerRoles(event);
                break;
            }
    },

    registerRoles: function(event) {
        event.preventDefault();
        
        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.registerRoles(App.originFarmerID, App.distributorID, App.retailerID, App.consumerID, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    harvestItem: function(event) {
        event.preventDefault();
        
        const self = this;
        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.harvestItem(
                App.upc, 
                App.metamaskAccountID, 
                App.originFarmName, 
                App.originFarmInformation, 
                App.originFarmLatitude, 
                App.originFarmLongitude, 
                App.productNotes,
                {from: App.metamaskAccountID}
            );
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('harvestItem',result);
            self.updateProductInfo();
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    processItem: function (event) {
        event.preventDefault();
        
        const self = this;
        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.processItem(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('processItem',result);
            self.updateProductInfo();
        }).catch(function(err) {
            console.log(err.message);
        });
    },
    
    packItem: function (event) {
        event.preventDefault();
        
        const self = this;
        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.packItem(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('packItem',result);
            self.updateProductInfo();
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    sellItem: function (event) {
        event.preventDefault();
        
        const self = this;
        App.contracts.SupplyChain.deployed().then(function(instance) {
            const productPrice = web3.toWei(App.productPrice, "ether");
            console.log('productPrice',productPrice);
            return instance.sellItem(App.upc, productPrice, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('sellItem',result);
            self.updateProductInfo();
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    buyItem: function (event) {
        event.preventDefault();
        
        const self = this;
        App.contracts.SupplyChain.deployed().then(function(instance) {
            const walletValue = web3.toWei(3, "ether");
            console.log("walletValue", walletValue);
            return instance.buyItem(App.upc, {from: App.metamaskAccountID, value: walletValue});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('buyItem',result);
            self.updateProductInfo();
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    shipItem: function (event) {
        event.preventDefault();
        
        const self = this;
        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.shipItem(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('shipItem',result);
            self.updateProductInfo();
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    receiveItem: function (event) {
        event.preventDefault();
        
        const self = this;
        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.receiveItem(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('receiveItem',result);
            self.updateProductInfo();
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    purchaseItem: function (event) {
        event.preventDefault();
        
        const self = this;
        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.purchaseItem(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('purchaseItem',result);
            self.updateProductInfo();
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    updateProductInfo: function () {
        App.upc = $('#upc').val();
        
        const self = this;
        App.contracts.SupplyChain.deployed().then(function(instance) {
          return instance.fetchItemBufferOne(App.upc);
        }).then(function(result) {
          $("#ftc-item").text(result);
          console.log('fetchItemBufferOne', result);
          $("#ftc-farmer-name").html("Farm   name: " + result[4]);
          $("#ftc-farm-info").html("Farm info: " + result[5]);
          $("#ftc-farm-location").html('<iframe width="450" height="350" frameborder="0" style="border:0" src="https://www.google.com/maps/embed/v1/place?key=AIzaSyDzJ0VAvEgcj0jEXmukHUwGuvexQr4UG80&q=' + result[6] + ',' + result[7] + '&zoom=8" allowfullscreen></iframe>');

          $("#ftc-product-description").html("<div>OwnerID: " + result.ownerID + "</div>");
        
          let isFarmDefined = false;
          if (result.originFarmName) {
            isFarmDefined = true;
            $("#originFarmName").val(result.originFarmName);
            $("#originFarmInformation").val(result.originFarmInformation);
            $("#originFarmLatitude").val(result.originFarmLatitude);
            $("#originFarmLongitude").val(result.originFarmLongitude);
          }
          $("#originFarmName").prop('disabled', isFarmDefined);
          $("#originFarmInformation").prop('disabled', isFarmDefined);
          $("#originFarmLatitude").prop('disabled', isFarmDefined);
          $("#originFarmLongitude").prop('disabled', isFarmDefined);

          self.fetchItemBufferTwo();
        }).catch(function(err) {
          console.log(err.message);
        });
    },

    fetchItemBufferTwo: function () {
        App.contracts.SupplyChain.deployed().then(function(instance) {
          return instance.fetchItemBufferTwo.call(App.upc);
        }).then(function(result) {
          $("#ftc-item").text(result);
          console.log('fetchItemBufferTwo', result);
          if (result.productID > 0) {
            $("#ftc-product-description").append("<div>Notes: " + result.productNotes + "</div>");
            $("#ftc-product-description").append("<div>Product ID: " + result.productID + "</div>");
            $("#ftc-product-description").append("<div>UPC: " + result.itemUPC + "</div>");
            $("#ftc-product-description").append("<div>SKU: " + result.itemSKU + "</div>");
            $("#ftc-product-description").append("<div>State: " + States[result.itemState] + "</div>");
          }
          const isForSale = result.productID && result.itemState >= 3;
          const isSold = result.productID && result.itemState >= 4;
          $("#productPrice").prop('disabled', isForSale);
          $("#productNotes").prop('disabled', isSold);

          if (isSold) {
            $("#productNotes").productNotes = result.productNotes;
          }
          if (isForSale) {
            const productPrice = web3.fromWei(result.productPrice, "ether" );
            $("#productPrice").val(productPrice);
            $("#ftc-product-description").append("<div>Price: " + productPrice + " ETH</div>");          
          }
        }).catch(function(err) {
          console.log(err.message);
        });
    },

    fetchEvents: function () {
        if (typeof App.contracts.SupplyChain.currentProvider.sendAsync !== "function") {
            App.contracts.SupplyChain.currentProvider.sendAsync = function () {
                return App.contracts.SupplyChain.currentProvider.send.apply(
                App.contracts.SupplyChain.currentProvider,
                    arguments
              );
            };
        }
        App.contracts.SupplyChain.deployed().then(function(instance) {
            instance.allEvents(function(err, log){
            if (!err)
                $("#ftc-events").append('<li>' + log.event + ' - ' + log.transactionHash + '</li>');
            });
        }).catch(function(err) {
          console.log(err.message);
        });
        
    }
};

$(function () {
    $(window).load(function () {
        App.init();
    });
});