'use strict';

// Safari datepicker
if (document.getElementById("birth_date") && document.getElementById("birth_date").type != "date") {
  // document.write('<link href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/base/jquery-ui.css" rel="stylesheet" type="text/css" />\n');
  document.write('<script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"><\/script>\n');
}

$(document).ready(function () {
  //disable context
  $(document).bind("contextmenu", function (e) {
    return false;
  });

  // Custom select
  var x, i, j, selElmnt, a, b, c;
  x = document.getElementsByClassName("custom-select");
  for (i = 0; i < x.length; i++) {
    selElmnt = x[i].getElementsByTagName("select")[0];
    a = document.createElement("DIV");
    a.setAttribute("class", "select-selected default");
    a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
    x[i].appendChild(a);
    b = document.createElement("DIV");
    b.setAttribute("class", "select-items select-hide");
    for (j = 1; j < selElmnt.length; j++) {
      c = document.createElement("DIV");
      c.innerHTML = selElmnt.options[j].innerHTML;
      c.addEventListener("click", function (e) {
        var y, i, k, s, h;
        s = this.parentNode.parentNode.getElementsByTagName("select")[0];
        h = this.parentNode.previousSibling;
        for (i = 0; i < s.length; i++) {
          if (s.options[i].innerHTML == this.innerHTML) {
            s.selectedIndex = i;
            h.innerHTML = this.innerHTML;
            y = this.parentNode.getElementsByClassName("same-as-selected");
            for (k = 0; k < y.length; k++) {
              y[k].removeAttribute("class");
            }
            this.setAttribute("class", "same-as-selected");
            break;
          }
        }

        // trigger event
        $(s).trigger('change');

        h.click();
      });
      b.appendChild(c);
    }
    x[i].appendChild(b);
    a.addEventListener("click", function (e) {
      e.stopPropagation();
      closeAllSelect(this);
      this.nextSibling.classList.toggle("select-hide");
      this.classList.toggle("select-arrow-active");
    });
  }
  function closeAllSelect(elmnt) {
    var x, y, i, arrNo = [];
    x = document.getElementsByClassName("select-items");
    y = document.getElementsByClassName("select-selected");
    for (i = 0; i < y.length; i++) {
      if (elmnt == y[i]) {
        arrNo.push(i)
      } else {
        y[i].classList.remove("select-arrow-active");
      }
    }
    for (i = 0; i < x.length; i++) {
      if (arrNo.indexOf(i)) {
        x[i].classList.add("select-hide");
      }
    }
  }
  document.addEventListener("click", closeAllSelect);
  // end custom select

  // form-input
  $('input').focus(function () {
    $(this).parents('.form-group').addClass('focused');
  });

  $('input').blur(function () {
    var inputValue = $(this).val();
    if (inputValue == "") {
      $(this).removeClass('filled');
      $(this).parents('.form-group').removeClass('focused');
    } else {
      $(this).addClass('filled');
    }
  });

  //validate email
  function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,6})+$/;
    return regex.test(email);
  };

  // field doesn't consist of spaces
  function ifNotSpace(field) {
    var regex = /\S/;
    return regex.test(field);
  }

  // validate form
  var email = $('#email');
  var customerSubmitLabel = $('#customer_form_label');
  var customerSubmit = $('#customer_form_submit');
  var text_inputs = $('.user-form input[type=text]:not([name=address2])');
  var birth_date = $('#birth_date');
  var gender_select = $('select[name=gender]');
  var phone = $('#phone');
  var terms = $('#terms');

  // get search params data
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const first_name_param = urlParams.get('first_name');
  const last_name_param = urlParams.get('last_name');
  const birth_date_param = urlParams.get('birth_date');
  const gender_param = urlParams.get('gender');
  // console.log(first_name_param, last_name_param, birth_date_param, gender_param)

  if ($('.step-4').length > 0) {
    $('input[name=first_name]').val(first_name_param);
    $('input[name=last_name]').val(last_name_param);
    $('input[name=birth_date]').val(birth_date_param);
    $('input[name=gender]').val(gender_param);
  }

  var form_validation = function () {
    var text_inputs_filled_arr = [];
    var text_inputs_filled = false;

    // text inputs require validation
    text_inputs.each(function () {
      if ($(this).val() === '' || !ifNotSpace($(this).val())) {
        text_inputs_filled_arr.push(false)
        $(this).closest('div').addClass('required');
      } else {
        text_inputs_filled_arr.push(true)
        $(this).closest('div').removeClass('required');
      }
    })

    // check if all text inputs are filled
    text_inputs_filled = !text_inputs_filled_arr.includes(false);

    // birth_date validation
    if (birth_date.val() === "") {
      birth_date.closest('div').addClass('required');
    } else {
      birth_date.closest('div').removeClass('required');
    }

    // gender validation
    if (gender_select.val() === "") {
      gender_select.closest('div').addClass('required');
    } else {
      gender_select.closest('div').removeClass('required');
      gender_select.closest('.custom-select').find('.select-selected').addClass('select-filled');
    }

    // email validation
    if (!isEmail(email.val()) && !email.hasClass('required')) {
      email.closest('div').addClass('invalid-email');
    } else {
      email.closest('div').removeClass('invalid-email');
    }

    // form validation
    if (
      $('.step-3').length > 0 &&
      birth_date.val() !== "" &&
      gender_select.val() !== "" &&
      text_inputs_filled === true
      ||
      $('.step-4').length > 0 &&
      email && isEmail(email.val()) &&
      text_inputs_filled === true &&
      $(terms).is(':checked')
    ) {
      customerSubmit.removeAttr('disabled');
      customerSubmitLabel.removeClass('disabled');
    } else {
      customerSubmit.attr('disabled', 'disabled');
      customerSubmitLabel.addClass('disabled');
    }
  };

  email.change(function () {
    form_validation()
  });

  email.keyup(function () {
    form_validation()
  });

  text_inputs.keyup(function () {
    form_validation()
  });

  birth_date.change(function () {
    form_validation()
  });

  gender_select.change(function () {
    form_validation()
  });

  terms.click(form_validation);

  customerSubmit.click(form_validation);

  // user-form
  if ($('.form-group').length > 0) {
    setTimeout(function () {
      $('.form-group').each(function () {
        if ($(this).find('input').val().length > 0) {
          $(this).addClass('focused');
          $(this).find('.form-input').addClass('filled');
        }
      });

      if ($("#birth_date").length > 0) {
        $("#birth_date").attr('data-date', $("#birth_date").val());
      };
    }, 100)
  };

  // number
  $.fn.inputFilter = function (inputFilter) {
    return this.on("input keydown keyup mousedown mouseup select contextmenu drop", function () {
      if (inputFilter(this.value)) {
        this.oldValue = this.value;
        this.oldSelectionStart = this.selectionStart;
        this.oldSelectionEnd = this.selectionEnd;
      } else if (this.hasOwnProperty("oldValue")) {
        this.value = this.oldValue;
        this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
      } else {
        this.value = "";
      }
    });
  };

  phone.inputFilter(function (value) {
    return /^[\+]?\d*$/.test(value);    // Allow digits only, using a RegExp
  });

  /* setup modal */
  var termsBtn = $('.terms-btn');
  var policyBtn = $('.policy-btn');
  var informationProvided = $('.information-provided');
  var termsModal = $('#modal-terms');
  var policyModal = $('#modal-policy');
  var modalInformation = $('#modal-information');
  var closeBtn = $('.ui-close-modal');

  termsBtn.on('click', function () {
    termsModal.addClass('show');
  });

  policyBtn.on('click', function () {
    policyModal.addClass('show');
  });

  informationProvided.on('click', function () {
    modalInformation.addClass('show');
  });

  closeBtn.on('click', function () {
    termsModal.removeClass('show');
    policyModal.removeClass('show');
    modalInformation.removeClass('show');
  });

  // close modal by clicking outside the modal window
  $('.modal-wrap').click(function (e) {
    if (e.target === $('.modal-wrap.show')[0]) {
      $('.modal-wrap').removeClass('show');
    }
  })
  /* end modal */

  // Slider
  if ($('.slider').length > 0) {
    const prevArrowBtn = `<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 10" fill="none" style="&#10;    transform: rotate(90deg);&#10;">
    <path d="M1.21436 1.64288L8.00007 8.4286L14.7858 1.64288" stroke="#979797" stroke-width="2" stroke-linecap="round"/>
    </svg></button>`;
    const nextArrowBtn = `<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 10" fill="none" style="&#10;    transform: rotate(-90deg);&#10;">
    <path d="M1.21436 1.64288L8.00007 8.4286L14.7858 1.64288" stroke="#979797" stroke-width="2" stroke-linecap="round"/>
    </svg></button>`;

    $('.slider').slick({
      dots: true,
      speed: 300,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: true,
      appendDots: $('.dots-block'),
      prevArrow: prevArrowBtn,
      nextArrow: nextArrowBtn
    });
  }

  // Date of birth
  $("#birth_date").on("change", function () {
    if (document.getElementById("birth_date") && document.getElementById("birth_date").type === "date") {
      $(this).css({ 'color': 'transparent' })
      if ($(this).val() === '') {
        $("#birth_date").addClass('change');
      } else {
        $("#birth_date").removeClass('change');
      };
      this.setAttribute(
        "data-date",
        moment(this.value, "YYYY-MM-DD")
          .format(this.getAttribute("data-date-format"))
      );
    };
    if ($(this).val() !== '') {
      $(this).closest('.form-group').addClass('focused');
      $(this).addClass('filled');
    };
  });

  // date - set max date
  if (document.getElementById("birth_date")) {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    if (dd < 10) {
      dd = '0' + dd
    }
    if (mm < 10) {
      mm = '0' + mm
    }

    today = yyyy + '-' + mm + '-' + dd;
    document.getElementById("birth_date").setAttribute("max", today);

    // Safari datepicker
    if (document.getElementById("birth_date").type != "date") { //if browser doesn't support input type="date", initialize date picker widget:
      $('#birth_date').datepicker({
        changeMonth: true,
        changeYear: true,
        dateFormat: 'yy-mm-dd'
      });
    }
  }

  // send timezone offset to server
  if (window.location.pathname.includes('/index.html')) {
    sessionStorage.setItem('setTimezoneReques_sent', 'false');
  };

  var setTimezoneReques_sent = sessionStorage.getItem('setTimezoneReques_sent');
  if (setTimezoneReques_sent !== 'true') {

    // get poll_session
    var req = new XMLHttpRequest();
    req.open('GET', document.location, false);
    req.send(null);
    var headers = req.getAllResponseHeaders().toLowerCase();
    var headersArr = headers.trim().split('\n');

    function getPollSession(arr) {
      var poll_session;

      arr.forEach(function (item) {
        var ItemKey = item.split(':')[0];
        var itemValue = item.split(':')[1];

        if (ItemKey === 'poll-session') {
          poll_session = itemValue;
        }
      })
      return poll_session;
    };

    var poll_session = getPollSession(headersArr) !== undefined ? getPollSession(headersArr).trim() : false;

    // get timezone offset
    var date = new Date();
    const currentTimeZoneOffsetInHours_func = () => {
      let offset = date.getTimezoneOffset() / 60;
      if (Math.sign(offset) === -1) {
        return Math.abs(offset);
      }
      if (Math.sign(offset) === 1) {
        return -Math.abs(offset);
      }
      if (Math.sign(offset) === 0 && Math.sign(offset) === -0) {
        return Math.abs(offset);
      }
    };

    const currentTimeZoneOffsetInHours = currentTimeZoneOffsetInHours_func();
    console.log(`current TimeZone Offset In Hours = ${currentTimeZoneOffsetInHours}`);

    var base_url = window.location.origin;
    var setTimezoneRequest_Url = `${base_url}/bo/poll-sessions/${poll_session}/set-tz-offset/${currentTimeZoneOffsetInHours}/`;
    $.ajax({
      url: setTimezoneRequest_Url,
      type: "GET",
      success: function (data) {
        console.log(data);
        // set setTimezoneReques_sent to true
        sessionStorage.setItem('setTimezoneReques_sent', 'true');
      },
      error: function (error_data) {
        console.log(error_data);
      }
    });
  };
  // end send timezone offset to server

});
