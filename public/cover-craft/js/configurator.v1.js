/**
 * Supprime l'élément de l'array
 *
 * @param {All} needle   Elément a supprimé
 * @returns {Void}
 */
Array.prototype.removeElement = function (needle) {
  this.splice(this.getIndex(needle), 1);
};

/**
 * Donne l'index de la valeur recherché
 *
 * @param {All} needle   Valeur recherché
 * @returns {Number}   Index de la valeur
 */
Array.prototype.getIndex = function (needle) {
  for (var i = 0; i < this.length; i++) {
    if (needle === this[i]) {
      return i;
    }
  }
  return -1;
};

/* CONFIGURATEUR */
(function ($, window, document) {
  // GLOBALS VARS
  var REPEAT = {
    NO: 0,
    REPEAT_X: 1,
    REPEAT_Y: 2,
    REPEAT: 3,
  };

  // GLOBAL FUNCTIONS
  /**
   * Permet de lancer une fonction après une durée déterminé
   * La fonction ne sera pas relancé avant la fin du temp
   * (évite la surcharge)
   *
   * @param {Function} func
   * @param {Int} delay
   * @returns {Function}
   */
  function throttle(func, delay) {
    var timer = null;

    return function () {
      var context = this,
        args = arguments;

      if (timer === null) {
        timer = setTimeout(function () {
          func.apply(context, args);
          timer = null;
        }, delay);
      }
    };
  }

  /**
   * Retourn les valeur en X et en Y sur un nouvel axe
   *
   * @param {Int} x   Le point en x
   * @param {Int} y   Le point en y
   * @param {Int} deg   La rotation du nouvel axe
   * @param {Int} xo   Le déplacement en x de l'origine du nouvel axe
   * @param {Int} yo   Le déplacement en y de l'origine du nouvel axe
   * @returns {Object}   Les nouvelles position en X et Y
   */
  function newAxe(x, y, deg, xo, yo) {
    xo = xo || 0;
    yo = yo || 0;

    return {
      x:
        (x - xo) * Math.cos((deg / 180) * Math.PI) +
        (y - yo) * Math.sin((deg / 180) * Math.PI),
      y:
        (y - yo) * Math.cos((deg / 180) * Math.PI) -
        (x - xo) * Math.sin((deg / 180) * Math.PI),
    };
  }

  function serializeXmlNode(xmlNode) {
    if (typeof window.XMLSerializer != "undefined") {
      return new window.XMLSerializer().serializeToString(xmlNode);
    } else if (typeof xmlNode.xml != "undefined") {
      return xmlNode.xml;
    }
    return "";
  }
  function serializeXmlChildsNode(xmlNode) {
    var string = "",
      len = xmlNode.childNodes.length,
      i;

    for (i = 0; i < len; i++) {
      string += serializeXmlNode(xmlNode.childNodes[i]);
    }

    return string;
  }

  /**
   * Permet le changement de l'index d'un élément
   *
   * @param {Int} index   L'index souhaité
   * @returns {jQuery}
   */
  $.fn.setToIndex = function (index) {
    var $this = $(this),
      currentIndex = $this.index();

    if (currentIndex !== index) {
      var $parent = $this.parent(),
        $childs = $parent.children();

      if (currentIndex < index) {
        $childs.eq(index).after($this);
      } else {
        $childs.eq(index).before($this);
      }
    }

    return this;
  };

  /**
   * Redéfini les options d'un select
   *
   * @param {Array} options
   * @returns {jQuery}
   */
  $.fn.setOptions = function (options) {
    if (typeof options !== "object" || this[0].tagName !== "SELECT")
      return this;

    var string = "";
    for (var i = 0; i < options.length; i++) {
      string += '<option value="' + options[i].value + '"';
      if (options[i].selected) string += ' selected="selected"';
      string += ">" + options[i].name + "</option>";
    }

    $(this).html(string).trigger("reset");

    return this;
  };

  /**
   * Converti un select en diférents motifs
   *
   * @param {Object} opt   Les options du motif Selector
   * @returns {jQuery}
   */
  $.fn.motifSelector = function (opt) {
    if (this[0].tagName !== "SELECT") return this;

    opt = $.extend({}, $.fn.motifSelector.default, opt);

    var self = this,
      $select = $(this);

    self.$motifContainer = $('<div class="motif-container">')
      .insertAfter($select)
      .on("click.motifManager", ".motif-selector", opt.onClick);

    self.$motifContainerInner = $(
      '<div class="motif-container__inner">',
    ).appendTo(self.$motifContainer);

    $select.hide().on("reset", function () {
      self.$motifContainerInner.html("");
      addMotifs();
    });
    addMotifs();

    /**
     * addMotifs()
     *
     * Ajoute tout les motifs après le select
     *
     * @return {Void}
     */
    function addMotifs() {
      var $option = null;
      var $motif = null;
      var motif = null;
      var nbMotif = $select.find(">option").each(function () {
        $option = $(this);

        motif = $option.attr("value");
        var $motifBase = $("#motif-" + motif);
        if ($motifBase.length) {
          $motif = $(
            '<div class="motif-selector" data-motif="' +
              motif +
              '" title="' +
              $option.text() +
              '"><svg viewBox="' +
              $motifBase.get(0).getAttributeNS(null, "viewBox") +
              '"><use xlink:href="#motif-' +
              motif +
              '"/></svg></div>',
          );
          self.$motifContainerInner.append($motif);
          $motif.draggable(opt.dragOption);
        } else {
          console.warn("motif error : " + motif + " not found");
        }
      }).length;

      self.$motifContainerInner.css("width", $motif.outerWidth() * nbMotif);

      $(window).trigger("resize");
    }
  };
  $.fn.motifSelector.default = {
    onClick: $.noop(),
    dragOption: {},
  };

  /**
   * Retourne les coordonées de l'événement Touch ou Click
   *
   * @param {Event} event   L'événement
   * @returns {Object}   Les coordonées de l'événement
   */
  function getTouches(event) {
    if (event.touches !== undefined && event.touches.length > 0) {
      return {
        x: event.touches[0].pageX,
        y: event.touches[0].pageY,
      };
    } else {
      if (event.pageX !== undefined) {
        return {
          x: event.pageX,
          y: event.pageY,
        };
      } else {
        return {
          x: event.clientX,
          y: event.clientY,
        };
      }
    }
  }

  /* ================================================ *\
           MOTIF
    \* ================================================ */
  var currentMotifId = 0;
  /**
   * Motif
   *
   * Il permet la création d'un objet Motif
   *
   * @param {string} name   nom du motif
   * @param {int} x   position en X
   * @param {int} y   la position en Y
   * @param {int} width   la largeur du motif
   * @param {int} height   la hauteur du motif
   * @param {string} color   la couleru du motif
   * @param {jQuery} $zone   la zone d'ajout (element jQuery)
   * @returns {Motif}   retour l'element pour la cascade
   */
  function Motif(name, x, y, width, height, color, $zone) {
    this.id = currentMotifId = currentMotifId + 1;

    // creation de l'element
    this.groupElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g",
    );
    this.groupElement.setAttributeNS(null, "id", "motif-" + this.id);
    this.element = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "use",
    );
    this.element.setAttributeNS(null, "id", "motif-" + this.id + "-use");
    this.element.setAttributeNS(null, "stroke", "none");
    this.element.setAttributeNS(null, "class", "motif");
    this.groupElement.appendChild(this.element);

    // ajout de la grille pour les repeat
    this.grid = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.grid.setAttributeNS(null, "id", "motif-" + this.id + "-grid");
    this.groupElement.appendChild(this.grid);
    //this.$grid = $('<g id="motif-' + this.id + '-grid"></g>').appendTo(this.groupElement);

    // ajout dans la zone
    this.$zone = $zone;
    this.$zone.append(this.groupElement);

    // definition des position, size et couleur
    this.setMotif(name)
      .setPosition(x, y)
      .setSize(width, height)
      .setColor(color)
      .setRepeat(REPEAT.NO);

    return this;
  }

  /**
   * Motif.setWidth
   *
   * Défini la largeur du motif
   *
   * @param {int} width
   * @returns {Motif.prototype}
   */
  Motif.prototype.setWidth = function (width) {
    this.width = width;
    this.element.setAttributeNS(null, "width", width);
    this.setRotate(this.rotate || 0);

    return this;
  };

  /**
   * Motif.setHeight
   *
   * Défini la hauteur du motif
   *
   * @param {int} height
   * @returns {Motif.prototype}
   */
  Motif.prototype.setHeight = function (height) {
    this.height = height;
    this.element.setAttributeNS(null, "height", height);
    this.setRotate(this.rotate || 0);

    return this;
  };

  /**
   * Motif.setSize
   *
   * Défini la taille du motif
   *
   * @param {int} width
   * @param {int} height
   * @returns {Motif.prototype}
   */
  Motif.prototype.setSize = function (width, height) {
    this.setWidth(width);
    this.setHeight(height);

    return this;
  };

  /**
   * Motif.setPosition
   *
   * Défini la position du motif
   *
   * @param {int} x
   * @param {int} y
   * @returns {Motif.prototype}
   */
  Motif.prototype.setPosition = function (x, y) {
    this.x = x;
    this.y = y;
    this.element.setAttributeNS(null, "x", x);
    this.element.setAttributeNS(null, "y", y);
    this.setRotate(this.rotate || 0);

    return this;
  };

  /**
   * Motif.setRotate
   *
   * Défini la rotation du motif
   *
   * @param {float} rotate
   * @returns {Motif.prototype}
   */
  Motif.prototype.setRotate = function (rotate) {
    this.rotate = rotate;
    //this.element.setAttributeNS(null,"transform", 'rotate(' + this.rotate + ' ' + (this.x + Math.round(this.width / 2 )) + ' ' + (this.y + Math.round(this.height / 2 )) + ')');
    this.element.setAttributeNS(
      null,
      "transform",
      "rotate(" + this.rotate + " " + this.x + " " + this.y + ")",
    );

    return this;
  };

  /**
   * Motif.setMotif
   *
   * Défini le motif du motif
   *
   * @param {string} name
   * @returns {Motif.prototype}
   */
  Motif.prototype.setMotif = function (name) {
    this.name = name;
    this.element.setAttributeNS(
      "http://www.w3.org/1999/xlink",
      "xlink:href",
      "#motif-" + name,
    );

    return this;
  };

  /**
   * Motif.setColor
   *
   * Défini la couleur du motif
   *
   * @param {string} color
   * @returns {Motif.prototype}
   */
  Motif.prototype.setColor = function (color) {
    this.color = color;
    //this.element.setAttributeNS(null,"fill",color);
    this.groupElement.setAttributeNS(null, "fill", color);

    return this;
  };

  /**
   * Motif.setRepeat
   *
   * Défini le repeat
   *
   * @param {Int} repeat
   * @returns {Motif.prototype}
   */
  Motif.prototype.setRepeat = function (repeat) {
    this.repeat = repeat;
    this.doRepeat();

    return this;
  };

  /**
   * Motif.doRepeat
   *
   * Effectu le repeat
   *
   * @returns {Void}
   */
  Motif.prototype.doRepeat = function () {
    // supression des enfants
    while (this.grid.firstChild) {
      this.grid.removeChild(this.grid.firstChild);
    }

    if (this.repeat === REPEAT.NO) {
    } else {
      // création du groupe pour la ligne 0
      var line = document.createElementNS("http://www.w3.org/2000/svg", "g");
      line.setAttributeNS(null, "id", "motif-" + this.id + "-line-0");
      this.grid.appendChild(line);

      // définition du nombre d'item par positions
      var itemsRange = [0, 0];
      if (this.repeat === REPEAT.REPEAT_X || this.repeat === REPEAT.REPEAT) {
        // création d'une ligne entière
        // ajout d'un item pour prévenir la rotation
        itemsRange = [
          -Math.ceil(this.x / this.width) - 1,
          Math.ceil((this.$zone.width() - this.x - this.width) / this.width) +
            1,
        ];
      }

      var axeWH = newAxe(this.width, this.height, -this.rotate),
        axeW = newAxe(this.width, 0, -this.rotate),
        axeH = newAxe(0, this.height, -this.rotate),
        axe = newAxe(-this.width, this.height, -this.rotate),
        x = Math.max(
          Math.abs(axeWH.x),
          Math.abs(axeW.x),
          Math.abs(axeH.x),
          Math.abs(axe.x),
        ),
        y = Math.max(
          Math.abs(axeWH.y),
          Math.abs(axeW.y),
          Math.abs(axeH.y),
          Math.abs(axe.y),
        );

      var use = null;
      for (var i = itemsRange[0]; i <= itemsRange[1]; i++) {
        use = document.createElementNS("http://www.w3.org/2000/svg", "use");
        use.setAttributeNS(null, "stroke", "none");
        use.setAttributeNS(null, "class", "motif");
        use.setAttributeNS(null, "x", i * x);
        use.setAttributeNS(null, "y", 0);
        use.setAttributeNS(
          "http://www.w3.org/1999/xlink",
          "xlink:href",
          "#motif-" + this.id + "-use",
        );
        line.appendChild(use);
      }

      if (this.repeat === REPEAT.REPEAT_Y || this.repeat === REPEAT.REPEAT) {
        // répétition de la ligne de haut en bas
        itemsRange = [
          -Math.ceil(this.y / this.height) - 1,
          Math.ceil(
            (this.$zone.height() - this.y - this.height) / this.height,
          ) + 1,
        ];

        for (i = itemsRange[0]; i <= itemsRange[1]; i++) {
          if (i === 0) {
            continue;
          }

          use = document.createElementNS("http://www.w3.org/2000/svg", "use");
          use.setAttributeNS(null, "stroke", "none");
          use.setAttributeNS(null, "id", "motif-" + this.id + "-line_" + i);
          use.setAttributeNS(null, "class", "motif");
          use.setAttributeNS(null, "x", 0);
          use.setAttributeNS(null, "y", i * y);
          use.setAttributeNS(
            "http://www.w3.org/1999/xlink",
            "xlink:href",
            "#motif-" + this.id + "-line-0",
          );
          this.grid.appendChild(use);
        }
      }
    }
  };

  /**
   * Motif.setIndex
   *
   * Change l'index du motif
   *
   * @param {Int} index
   * @returns {Motif.prototype}
   */
  Motif.prototype.setIndex = function (index) {
    $(this.groupElement).setToIndex(index);

    return this;
  };

  /**
   * Motif.destroy
   *
   * Détruit le motif
   *
   * @returns {Boolean}
   */
  Motif.prototype.destroy = function () {
    this.groupElement.parentNode.removeChild(this.groupElement);
    //delete this;

    return true;
  };

  /* ================================================ *\
           MANAGER
    \* ================================================ */
  /**
   * Manager
   *
   * il permet la création d'un objet Manager
   *
   * @param {string} name
   * @param {int} x
   * @param {int} y
   * @param {Configurateur} configurateur
   * @returns {Manager}
   */
  function Manager(name, x, y, configurateur) {
    var self = this;

    self.minWidth = 50;
    self.minHeight = 50;
    self.defaultSize = {
      width: 65,
      height: 65,
    };

    self.name = name;

    // ajout de l'élément
    var actionAuth = {
      move: true,
      resizeWidth: true,
      resizeHeight: true,
      resizeAll: true,
      rotate: true,
      index: {
        top: true,
        up: true,
        down: true,
        bottom: true,
      },
      cancel: false,
      remove: true,
    };
    var element = '<div class="manager">';

    if (actionAuth.move)
      element += '<div class="action action--move" title="Déplacer"></div>';

    if (actionAuth.resizeWidth)
      element +=
        '<div class="action action--width" title="Redimensionner la largeur"></div>';
    if (actionAuth.resizeHeight)
      element +=
        '<div class="action action--height" title="Redimensionner la hauteur"></div>';
    if (actionAuth.resizeAll)
      element +=
        '<div class="action action--size" title="Redimensionner"></div>';
    if (actionAuth.rotate)
      element += '<div class="action action--rotate" title="Rotation"></div>';

    if (
      actionAuth.index.top ||
      actionAuth.index.up ||
      actionAuth.index.down ||
      actionAuth.index.bottom
    ) {
      element +=
        '<div class="action-group action-group--vertical action-group--index">';

      if (actionAuth.index.top)
        element +=
          '<div class="action action--top" title="Mettre au 1er plan"></div>';
      if (actionAuth.index.up)
        element += '<div class="action action--up" title="Monter"></div>';
      if (actionAuth.index.down)
        element += '<div class="action action--down" title="Descendre"></div>';
      if (actionAuth.index.top)
        element +=
          '<div class="action action--bottom" title="Mettre au dernier plan"></div>';

      element += "</div>";
    }

    if (actionAuth.cancel)
      element +=
        '<div class="action action--button action--cancel alert" title="Annuler"></div>';
    if (actionAuth.remove)
      element +=
        '<div class="action action--button action--remove alert" title="Supprimer"></div>';

    element += "</div>";
    self.$element = $(element);
    // fin ajout élément

    self.activated = false;

    // définition dans le configurateur
    self.configurateur = configurateur;
    self.configurateur.$managerZone.append(self.$element);

    // définition du motif
    self.motif = new Motif(
      self.name,
      0,
      0,
      0,
      0,
      self.configurateur.motifColor,
      self.configurateur.$motifsZone,
    );

    // définition des position et tailles
    self
      .setPosition(x, y)
      .setMotif(self.name, self.defaultSize.width, self.defaultSize.height)
      .setColor(self.configurateur.motifColor)
      .setRotate(0)
      .setRepeat(self.configurateur.repeat);

    self.$element.data("manager", this);

    return self;
  }

  /**
   * Manager.setMotif
   *
   * Permet de changer le motif du managé avec ou sans redéfinir la taille
   *
   * @param {string} name
   * @param {int} width
   * @param {int} height
   * @returns {Manager.prototype}
   */
  Manager.prototype.setMotif = function (name, width, height) {
    this.name = name;
    width = width || 0;
    height = height || 0;
    var motif = document.getElementById("motif-" + name);

    if (motif === null) return this;

    // définition du nouveau motif
    this.motif.setMotif(name);

    // définition de la taille avec ratio
    if (width !== 0) {
      var viewBox = motif.getAttributeNS(null, "viewBox").split(" ");
      this.width = viewBox[2];
      this.height = viewBox[3];

      if (height !== 0) {
        this.setSize(width, height, 3);
      } else {
        this.setSize(width, 0, 1);
      }
    }

    return this;
  };

  /**
   * Manager.setWidth
   *
   * Permet de redéfinir la largeur du managé
   *
   * @param {int} width
   * @returns {Manager.prototype}
   */
  Manager.prototype.setWidth = function (width) {
    if (width < this.minWidth) {
      width = this.minWidth;
    }
    this.width = width;
    this.$element.width(width);
    this.motif.setWidth(width);

    return this;
  };

  /**
   * Manager.setHeight
   *
   * Permet de redéfinir la hauteur du managé
   *
   * @param {int} height
   * @returns {Manager.prototype}
   */
  Manager.prototype.setHeight = function (height) {
    if (height < this.minHeight) {
      height = this.minHeight;
    }
    this.height = height;
    this.$element.height(height);
    this.motif.setHeight(height);

    return this;
  };

  /**
   * Manager.setSize
   *
   * Permet de changer la taille du managé avec ou sans ratio
   *
   * @param {int} width
   * @param {int} height
   * @param {int} type
   *      - type == 0 : pas de ratio gardé
   *      - type == 1 : ratio sur la width
   *      - type == 2 : ratio sur la height
   *      - type == 3 : Element a l'interieur de la taille demandé avec ratio
   *      - type == 4 : Element a l'extérieur de la taille demandé avec ratio
   * @returns {Manager.prototype}
   */
  Manager.prototype.setSize = function (width, height, type) {
    type = type || 0;

    if (type === 1) {
      height = (this.width / this.height) * width;
    } else if (type === 2) {
      width = (this.height / this.width) * height;
    } else if (type !== 0) {
      var ratio = this.height / this.width;

      if (ratio >= height / width && type === 3) {
        width = height / ratio;
      } else {
        height = width * ratio;
      }
    }

    this.setWidth(width, false);
    this.setHeight(height, false);

    return this;
  };

  /**
   * Manager.setPosition
   *
   * Permet de changer la position du managé
   *
   * @param {int} x
   * @param {int} y
   * @returns {Manager.prototype}
   */
  Manager.prototype.setPosition = function (x, y) {
    this.x = x;
    this.y = y;
    this.$element.css({
      left: x,
      top: y,
    });
    this.motif.setPosition(x, y);

    return this;
  };

  /**
   * Manager.setRotate
   *
   * Défini la rotation
   *
   * @param {Int} rotate   L'angle en degres
   * @returns {Manager.prototype}
   */
  Manager.prototype.setRotate = function (rotate) {
    this.rotate = rotate;
    this.$element.css({
      "-webkit-transform": "rotate(" + rotate + "deg)",
      "-moz-transform": "rotate(" + rotate + "deg)",
      transform: "rotate(" + rotate + "deg)",
    });
    this.motif.setRotate(rotate);

    return this;
  };

  /**
   * Manager.setRepeat
   *
   * Permet de changer la répétition du managé
   *
   * @param {Int} repeat
   * @returns {Manager.prototype}
   */
  Manager.prototype.setRepeat = function (repeat) {
    this.motif.setRepeat(repeat);

    return this;
  };

  /**
   * Manager.setColor
   *
   * Défini la couleur
   *
   * @param {String} color
   * @returns {Manager.prototype}
   */
  Manager.prototype.setColor = function (color) {
    this.motif.setColor(color);
    this.$element.css("outline-color", color);

    return this;
  };

  /**
   * Manager.setIndex
   *
   * Défini l'index
   *
   * @param {Int} index
   * @returns {Manager.prototype|Boolean}
   */
  Manager.prototype.setIndex = function (index) {
    var currentIndex = this.$element.index(),
      indexMax = this.configurateur.managers.length - 1;

    if (typeof index === "string") {
      if (index === "top") {
        index = indexMax;
      } else if (index === "up") {
        index = currentIndex + 1;
      } else if (index === "down") {
        index = currentIndex - 1;
      } else if (index === "bottom") {
        index = 0;
      }
    }
    // vérifie qu'il y a quelque chose a faire
    if (isNaN(index) || index < 0 || index > indexMax) return false;

    this.$element.setToIndex(index);
    this.motif.setIndex(index);

    return this;
  };

  /**
   * Manager.active
   *
   * Active le manager
   *
   * @param {Boolean} activation   Active ou désactive
   * @returns {Manager.prototype}
   */
  Manager.prototype.active = function (activation) {
    if (activation === true && this.activated === false) {
      var self = this,
        $window = $(window);

      // s'ajoute au manager actifs
      this.configurateur.addActiveManager(this);

      // défini les valeurs du formulaire
      this.configurateur.setFormEvent(false);
      // fonctionnalité supprimée
      //this.configurateur.$form.find('.configurator-input--motif').val(self.motif.name);
      this.configurateur.$form
        .find(".configurator-input--motif-color")
        .val(self.motif.color)
        .trigger("change");
      // checkbox
      //this.configurateur.$form.find('.configurator-input--repeat[value="' + self.motif.repeat + '"]').prop('checked', true);
      // select
      this.configurateur.$form
        .find(".configurator-input--repeat")
        .val(self.motif.repeat)
        .trigger("change");

      this.configurateur.setFormEvent(true);

      // ajoute les événement
      this.$element
        .addClass("is-active")
        .on("click.manager.action", ".action--remove", function (e) {
          e.preventDefault();
          e.stopPropagation();

          self.destroy();
        })
        .on(
          "click.manager.action",
          ".action--top, .action--up, .action--down, .action--bottom",
          function (e) {
            e.preventDefault();
            e.stopPropagation();

            var $this = $(this),
              index = 0;

            if ($this.hasClass("action--top")) {
              index = "top";
            } else if ($this.hasClass("action--up")) {
              index = "up";
            } else if ($this.hasClass("action--down")) {
              index = "down";
            } else if ($this.hasClass("action--bottom")) {
              index = "bottom";
            }

            self.setIndex(index);
          },
        )
        .on(
          "touchstart.manager mousedown.manager",
          ".action--move, .action--rotate, .action--size, .action--width, .action--height",
          function (event) {
            event.preventDefault();
            event.stopPropagation();

            var e = event.originalEvent || event || window.event,
              base = getTouches(e),
              current = base,
              dragEnd = false,
              moveAction = function (event) {},
              $this = $(this),
              mouseMoveFunction = throttle(function (e) {
                if (!dragEnd) {
                  moveAction(e);

                  doRepeatFunction();
                }
              }, 150),
              doRepeatFunction = throttle(function () {
                self.motif.doRepeat();
              }, 400);

            if ($this.hasClass("action--move")) {
              var selfX = self.x,
                selfY = self.y;

              moveAction = function (event) {
                self.setPosition(
                  current.x - base.x + selfX,
                  current.y - base.y + selfY,
                );
              };
            } else if ($this.hasClass("action--rotate")) {
              var rotate = self.rotate;

              moveAction = function () {
                /*
                                var signe = 0,
                                    rotated = 0,
                                    deplacement = {
                                        x: current.x - base.x,
                                        y: current.y - base.y
                                    };
                                    
                                if(deplacement.y === 0) {
                                    if(deplacement.x > 0) {
                                        rotated = 90;
                                    } else {
                                        rotated = 270;
                                    }
                                } else {
                                    if (deplacement.y > 0) {
                                        signe = 180;
                                    } else {
                                    }
                                    rotated = (signe - Math.atan(deplacement.x /  deplacement.y )*180/Math.PI) % 360;
                                }
                                */

                var rotated = (current.x - base.x + rotate) % 360;
                if (shiftPressed) {
                  rotated = Math.round(rotated / (360 / 16)) * (360 / 16);
                }
                self.setRotate(rotated);
              };
            } else if ($this.hasClass("action--size")) {
              base.width = self.width;
              base.height = self.height;

              moveAction = function (event) {
                var axe = newAxe(
                    current.x - base.x,
                    current.y - base.y,
                    self.rotate,
                  ),
                  width = axe.x + base.width,
                  height = axe.y + base.height;

                if (shiftPressed) {
                  width = Math.round(width / 10) * 10;
                  height = Math.round(height / 10) * 10;
                }

                self.setSize(width, height, 3);
              };
            } else if ($this.hasClass("action--width")) {
              base.width = self.width;

              moveAction = function () {
                var axe = newAxe(
                    current.x - base.x,
                    current.y - base.y,
                    self.rotate,
                  ),
                  width = axe.x + base.width;

                if (shiftPressed) {
                  width = Math.round(width / 10) * 10;
                }

                self.setWidth(width);
              };
            } else if ($this.hasClass("action--height")) {
              base.height = self.height;

              moveAction = function () {
                var axe = newAxe(
                    current.x - base.x,
                    current.y - base.y,
                    self.rotate,
                  ),
                  height = axe.y + base.height;

                if (shiftPressed) {
                  height = Math.round(height / 10) * 10;
                }

                self.setHeight(height);
              };
            }

            // shift function
            var shiftPressed = false;
            window.addEventListener("keydown", function (ev) {
              var key;
              if (window.event) {
                key = window.event.keyCode;
              } else {
                key = ev.which;
              }
              if (key === 16) {
                shiftPressed = true;

                var keyup = function () {
                  shiftPressed = false;
                  window.removeEventListener("keyup", keyup);
                };

                window.addEventListener("keyup", keyup);
              }
            });

            $window
              .on("touchmove.manager mousemove.manager", function (event) {
                event.preventDefault();
                event.stopPropagation();

                var e = event.originalEvent || event || window.event;
                current = getTouches(e);

                mouseMoveFunction();
              })
              .on(
                "touchend.manager touchcancel.manager mouseup.manager",
                function (event) {
                  event.preventDefault();
                  event.stopPropagation();

                  var e = event.originalEvent || event || window.event;

                  dragEnd = true;

                  moveAction(e);
                  self.motif.doRepeat();

                  $window
                    .off("touchmove.manager mousemove.manager")
                    .off(
                      "touchend.manager touchcancel.manager mouseup.manager",
                    );

                  // empèche la désactivation de l'élément
                  self.configurateur.setManagerEvent(false);
                  setTimeout(function () {
                    self.configurateur.setManagerEvent(true);
                  }, 50);
                },
              );
          },
        );
    } else if (activation === false && this.activated === true) {
      // supprime les événements et des managers actifs
      this.$element.removeClass("is-active").off("click.manager.action");

      // supprime des managers actifs
      this.configurateur.removeActiveManager(this);
    }

    this.activated = activation;

    return this;
  };

  /**
   * Manager.destroy
   *
   * Détruit le manager
   *
   * @param {Boolean} fromParent   Si l'événement viens du configurateur
   * @returns {Boolean}
   */
  Manager.prototype.destroy = function (fromParent) {
    if (!fromParent) {
      this.configurateur.removeManager(this);
    }
    this.motif.destroy();
    this.$element.remove();
    //delete this;

    return true;
  };

  /* ================================================ *\
           CONFIGURATEUR
    \* ================================================ */
  /**
   * Configurateur
   *
   * Permet de creer un objet Configurateur
   *
   * @param {jQuery} $element   zone de configuration
   * @param {jQuery} $form   formulaire de configuration
   * @param {Array} styles   les différents styles
   * @returns {Configurateur}
   */
  function Configurateur($element, $form, styles) {
    var self = this;
    self.styles = styles;
    self.maxActiveManager = 1;
    self.$element = $element;
    self.width = self.$element.width();
    self.height = self.$element.height();
    self.$form = $form;
    self.beforeUnloadMessage = "Toute la configuration sera perdue.";
    self.beforeChangeStyle =
      "Si vous changez de style, cette parure sera perdue. Voulez vous continuer ?";

    // === ZONES ===
    self.$motifsZone = self.$element.find(".motifs-zone");
    self.$motifsZone
      .get(0)
      .setAttributeNS(null, "viewBox", "0 0 " + self.width + " " + self.height);

    // ajout de la zone d'outils
    self.$managerZone = self.$element.find(".managers-zone");
    if (!self.$managerZone) {
      self.$element.append('<div class="outils-zone"/>');
    }

    // === VARIABLES ===
    self.managers = []; // contient des "Manages"
    self.activeManagers = []; // contient des "Manages" actifs
    self.setStyle(this.$form.find(".configurator-input--style").val());

    this.setManagerEvent(true);
    this.setFormEvent(true);
    self.setConfigurateurPosition();

    $(window).on("resize", function () {
      self.setConfigurateurPosition();
    });

    // ajout de la sauvegarde
    self.$form.on("submit.configurateur", function (e) {
      e.preventDefault();
      self.save.call(self);
    });

    // ajout d'un accès via la variable configurateur de l'élément
    self.$element.data("configurateur", this);

    // ajout du drop
    self.$element.droppable({
      accept: ".motif-selector",
      drop: function (ev, ui) {
        self.addManager(
          ui.helper.data("motif"),
          ui.offset.left - self.x,
          ui.offset.top - self.y,
          true,
        );
      },
    });

    // ajout du drag && du motifSelector
    var dragBase = null; // pour scroller dans l'élément
    self.$form.find(".configurator-input--motif").motifSelector({
      onClick: function () {
        self.addManager(
          $(this).data("motif"),
          self.width / 2 - 50,
          self.height / 2 - 50,
          true,
        );
      },
      dragOption: {
        distance: 10,
        //delay: 300,
        appendTo: self.$form,
        helper: "clone",
        revert: "invalid",
        //revert: true,
        revertDuration: false,
        opacity: 0.7,
        zIndex: 200,
        start: function (ev, ui) {
          // défini le scroll de base
          $scrollElm = $(this).closest(".motif-container");
          if ($scrollElm.css("overflow-x") === "auto") {
            dragBase = getTouches(ev);
            dragBase.scrollLeft = $scrollElm.scrollLeft();
          }
          if ($scrollElm.css("overflow-y") === "auto") {
            dragBase = getTouches(ev);
            dragBase.scrollTop = $scrollElm.scrollTop();
          }
        },
        drag: function (ev, ui) {
          if (dragBase !== null) {
            // scroll de l'élément
            var curentDrag = getTouches(ev);
            if (typeof dragBase.scrollLeft !== "undefined") {
              if (Math.abs(dragBase.y - curentDrag.y) < 30) {
                $scrollElm.scrollLeft(
                  dragBase.x - curentDrag.x + dragBase.scrollLeft,
                );
              }
            } else if (typeof dragBase.scrollTop !== "undefined") {
              if (Math.abs(dragBase.x - curentDrag.x) < 30) {
                $scrollElm.scrollTop(
                  dragBase.y - curentDrag.y + dragBase.scrollTop,
                );
              }
            }
          }
        },
        stop: function (ev, ui) {
          dragBase = null;
        },
      },
    });

    // ajout d'un color picker
    self.$form.find(".color-select").simplecolorpicker({
      picker: true,
    });

    return this;
  }

  /**
   * Configurateur.setManagerEvent
   *
   * Creer les événements des managers basic
   *
   * @param {type} activation
   * @returns {Void}
   */
  Configurateur.prototype.setManagerEvent = function (activation) {
    if (activation) {
      var self = this;
      // self.$managerZone.on('click.manager.active', function(e){
      $(window).on("click.manager.active", function (e) {
        var $this = $(e.target),
          // $manager = $this.closest(self.$managerZone.find('.manager'));
          $manager = $this.closest(".manager");

        if (!$manager.length) {
          // vérifie qu'on ne soit pas dans le formulaire (sinon décoche automatiquement)
          if (
            !$this.closest(self.$form).length &&
            !$this.closest(".simplecolorpicker").length
          ) {
            self.removeAllActiveManager();
          } else {
          }
        } else {
          $manager.data("manager").active(true);
        }
      });
    } else {
      // this.$managerZone.off('click.manager.active');
      $(window).off("click.manager.active");
    }
  };

  /**
   * Configurateur.setConfigurateurPosition
   *
   * Met en place l'offset du configurateur
   *
   * @returns {Configurateur.prototype}
   */
  Configurateur.prototype.setConfigurateurPosition = function () {
    var offset = this.$element.offset();
    this.x = offset.left;
    this.y = offset.top;

    return this;
  };

  /**
   * Configurateur.setFormEvent
   *
   * Permet l'ajout ou la suppression des événement de formulaire
   *
   * @param {Boolean} activation
   * @returns {Configurateur.prototype}
   */
  Configurateur.prototype.setFormEvent = function (activation) {
    var self = this;

    if (activation) {
      this.$form.on(
        "change.configurateur",
        ".configurator-input",
        function (event) {
          var e = event.originalEvent || event || window.event;
          var $this = $(this);

          if ($this.hasClass("configurator-input--style")) {
            self.setStyle($this.val());
          } else if ($this.hasClass("configurator-input--motif")) {
            //self.setMotif($this.val());
          } else if ($this.hasClass("configurator-input--color")) {
            self.setColor($this.val());
          } else if ($this.hasClass("configurator-input--motif-color")) {
            self.setMotifColor($this.val());
          } else if ($this.hasClass("configurator-input--repeat")) {
            self.setRepeat(parseInt($this.val()));
          }
        },
      );
    } else {
      this.$form.off("change.configurateur");
    }

    return this;
  };

  /**
   * Configurateur.setStyle
   *
   * Défini le style du configurateur
   *
   * @param {String|Int} style   La valeur du style
   * @returns {Configurateur.prototype}
   */
  Configurateur.prototype.setStyle = function (style) {
    if (this.managers.length <= 0 || confirm(this.beforeChangeStyle)) {
      this.style = style;

      this.removeAllManager();

      for (var i = 0; i < this.styles.length; i++) {
        if (this.styles[i].value == style) {
          this.$form.addClass("is-loading");

          this.setFormEvent(false);

          this.$form
            .find(".configurator-input--motif")
            .setOptions(this.styles[i].motifs);
          var color = this.$form
            .find(".configurator-input--color")
            .setOptions(this.styles[i].colors)
            .val();
          var motifColor = this.$form
            .find(".configurator-input--motif-color")
            .setOptions(this.styles[i].motifColors)
            .val();

          this.setColor(color) // la couleur du fond
            .setMotifColor(motifColor); // la couleur des nouveaux motifs

          this.setFormEvent(true);

          this.$form.removeClass("is-loading");

          return this;
        }
      }
    }

    return this;
  };

  /**
   * Configurateur.setColor
   *
   * Change la couleur de fond
   *
   * @param {String} color
   * @returns {Configurateur.prototype}
   */
  Configurateur.prototype.setColor = function (color) {
    this.color = color;
    this.$element.css("background-color", color);

    return this;
  };

  /**
   * Configurateur.setMotif
   *
   * Permet de changer la couleur des motifs
   *
   * @param {String} motif
   * @returns {Configurateur.prototype}
   */
  Configurateur.prototype.setMotif = function (motif) {
    for (var i = 0; i < this.activeManagers.length; i++) {
      this.activeManagers[i].setMotif(motif);
    }

    return this;
  };

  /**
   * Configurateur.setMotifColor
   *
   * Permet de changer la couleur des motifs
   *
   * @param {String} motifColor
   * @returns {Configurateur.prototype}
   */
  Configurateur.prototype.setMotifColor = function (motifColor) {
    this.motifColor = motifColor;
    this.$form.attr("style", "fill: " + motifColor);

    for (var i = 0; i < this.activeManagers.length; i++) {
      this.activeManagers[i].setColor(motifColor);
    }

    return this;
  };

  /**
   * Configurateur.setRepeat
   *
   * Change le repeat
   *
   * @param {Int} repeat
   * @returns {Configurateur.prototype}
   */
  Configurateur.prototype.setRepeat = function (repeat) {
    this.repeat = repeat;

    for (var i = 0; i < this.activeManagers.length; i++) {
      this.activeManagers[i].setRepeat(repeat);
    }

    return this;
  };

  /**
   * Configurateur.addManager
   *
   * Permet l'ajout d'un manager
   *
   * @param {String} name
   * @param {Int} x
   * @param {Int} y
   * @returns {Configurateur.prototype}
   */
  Configurateur.prototype.addManager = function (name, x, y, autoActive) {
    var manager = new Manager(name, x, y, this);
    this.managers.push(manager);

    if (autoActive) {
      manager.active(true);
    }

    // Ajout de la confirmation avant recharge ou fermeture
    if (this.managers.length === 1) {
      var self = this;
      $(window).on("beforeunload.configurateur", function () {
        return self.beforeUnloadMessage;
      });
      this.$form.addClass("has-motif");
    }

    return this;
  };

  /**
   * Configurateur.removeManager
   *
   * Permet la suppression d'un manager (appelé depuis le manager)
   *
   * @param {Manager} manager
   * @returns {Configurateur.prototype}
   */
  Configurateur.prototype.removeManager = function (manager) {
    this.managers.removeElement(manager);

    // Suppression de la confirmation
    if (this.managers.length <= 0) {
      $(window).off("beforeunload.configurateur");
      this.$form.removeClass("has-motif");
    }

    return this;
  };

  /**
   * Configurateur.removeAllManager
   *
   * Permet la suppression de tout les managers
   *
   * @returns {Configurateur.prototype}
   */
  Configurateur.prototype.removeAllManager = function () {
    // supression des actif avant suppression globale
    this.removeAllActiveManager();

    var len = this.managers.length;
    for (var i = 0; i < len; i++) {
      this.managers[len - 1 - i].destroy();
    }

    // Suppression de la confirmation
    $(window).off("beforeunload.configurateur");

    return this;
  };

  /**
   * Configurateur.addActiveManager
   *
   * Permet l'ajout d'un manager actif
   *
   * @param {Manager} manager
   * @returns {Boolean}
   */
  Configurateur.prototype.addActiveManager = function (manager) {
    this.$element.addClass("has-active");
    this.$form.addClass("has-active");

    if (this.activeManagers.length >= this.maxActiveManager) {
      // si il y a déjà le maximum, supression du plus ancien et ajout du nouveau
      this.removeActiveManager(this.activeManagers[0]);
      return this.addActiveManager(manager);
    } else {
      this.activeManagers.push(manager);
      return true;
    }
  };

  /**
   * Configurateur.removeActiveManager
   *
   * Permet la suppression d'un manager actif
   *
   * @param {Manager} manager
   * @returns {Boolean}
   */
  Configurateur.prototype.removeActiveManager = function (manager) {
    var index = this.activeManagers.getIndex(manager);
    if (index !== -1) {
      this.activeManagers.splice(index, 1);
      manager.active(false);
    }
    if (this.activeManagers.length <= 0) {
      this.$element.removeClass("has-active");
      this.$form.removeClass("has-active");
    }

    return true;
  };

  /**
   * Configurateur.removeAllActiveManager
   *
   * Permet la suppression de tout les managers actifs
   *
   * @returns {Boolean}
   */
  Configurateur.prototype.removeAllActiveManager = function () {
    var len = this.activeManagers.length;
    for (var i = 0; i < len; i++) {
      this.removeActiveManager(this.activeManagers[len - 1 - i]);
    }

    return true;
  };

  /**
   * Sauvegarde
   * @returns {Void}
   */
  Configurateur.prototype.save = function () {
    if (this.managers.length >= 0) {
      this.disable(true);

      // ajout des valeurs au prochain formulaire
      $("#input_style").val(this.style);
      $("#input_width").val(this.width);
      $("#input_height").val(this.height);
      $("#input_color").val(this.color);
      $("#input_creation").val(serializeXmlChildsNode(this.$motifsZone.get(0)));
    }
  };

  /**
   * Configurateur.disable
   *
   * Désactive ou réactive le configurateur
   *
   * @param {Boolean} disabled
   * @returns {Void}
   */
  Configurateur.prototype.disable = function (disabled) {
    if (disabled === true) {
      this.$element.addClass("is-disabled");
      this.$form.addClass("is-disabled");

      this.setFormEvent(false);
      this.setManagerEvent(false);
      //$(window).off('beforeunload.configurateur');
    } else {
      this.$element.removeClass("is-disabled");
      this.$form.removeClass("is-disabled");

      this.setFormEvent(true);
      this.setManagerEvent(true);

      //var self = this;
      //$(window).on('beforeunload.configurateur', function(){
      //    return self.beforeUnloadMessage;
      //});
    }
  };

  //Evènement de base
  function init() {
    if ($("#configurateur-zone").length && typeof styles !== "undefined") {
      var configurateur = new Configurateur(
        $("#configurateur-zone"),
        $("#creation-parure-form"),
        styles,
      );

      $("#back-to-configurateur").on("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        configurateur.disable(false);
      });
    }
  }

  // Le SVG est inline dans le DOM au chargement de la page (import Astro), donc on peut initialiser directement au ready.
  $(function () {
    init();
  });
})(window.jQuery, window, document);
