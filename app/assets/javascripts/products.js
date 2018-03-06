
var currentProduct = {};
var showForm = false;
var editingProduct;

function toggleForm() {
  showForm = !showForm;
  $('#product-form').remove();
  $('#products-list').toggle();

  if (showForm) {
    $.ajax({
      url: '/product_form',
      method: 'GET',
      data: { id: editingProduct }
    }).done( function(html) {
      $('#toggle').after(html);
    });
  }
}

function getProduct(id) {
  $.ajax({
    url: 'http://json-server.devpointlabs.com/api/v1/products' + id,
    method: 'GET'
  }).done( function(product) {
    if (editingProduct) {
      var li = $("[data-id='" + id + "'")
      
    }
    $('#products-list').append(product);
  });
}

$(document).ready( function() {
  
  $('#toggle').on('click', function() {
    toggleForm()
  });

  $(document).on('click', '#edit-product', function() {
    editingProduct = $(this).siblings('.product-item').data().id
    toggleForm();
  })

  $(document).on('submit', '#product-form form', function(e) {
    e.preventDefault()
    var data = $(this).serializeArray();
    $.ajax({
      url: 'http://json-server.devpointlabs.com/api/v1/products',
      type: 'POST',
      dataType: 'JSON',
      data: data,
    }).done( function(product) {
      toggleForm()
      getProduct(product.id)   
    }).fail( function(err) {
      alert(err.responseJSON.errors)
    });
  });

  

  $(document).on('click', '.product-item', function() {
    currentProduct.id = this.dataset.id
    $.ajax({
      url: 'http://json-server.devpointlabs.com/api/v1/products',
      method: 'GET',
      dataType: 'JSON'
    }).done( function(products) {
      var list = $('#products-list');
      list.empty();
      products.forEach( function(prod) {
        var li = '<div><li data-product-id="' + prod.id + '">' + prod.name + '</div><button class="btn" id="edit-product">Edit</button><button class="btn" id="delete-product">Delete</button></li>'
        list.append(li)
      });
    });
  });
});