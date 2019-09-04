/**
 * Page Builder Utils
 */
export default class Util {

	/**
	 * Function todo js templating
	 *
	 * $.supplant(text, json)
	 * $.supplant(element, json)
	 * 
	 */
	static supplant(template, json) {
		if (template && template.nodeType === Node.ELEMENT_NODE) {
			template = template.innerHTML;
		}

		var re = /{{([^{{}}]*)}}/g,
			reExp = /(^( )?(if|for|else|switch|case|break|\/if|\/for|\/else))(.*)?/g,
			reExp2 = /(^( )?(\/if|\/for|\/else))(.*)?/g,
			code = 'var r=[];\n',
			cursor = 0,
			match;

		var add = function (line, js) {
			if (js) {
				if (line.match(reExp)) {

					switch (match[1].split(' ')[0]) {
						case 'if':
						case 'for':
						case 'switch':
							code += line + '{' + '\n'
							break;
						case 'else':
							code += '} else {' + '\n'
							break;
						case 'elseif':
							code += '}' + line + '{' + '\n'
							break;
						case 'case':
							code += line + ':' + '\n'
							break;
						case '/if':
						case '/for':
							code += '}' + '\n'
							break;
						default:
							code += line + '\n'
					}

				} else {
					code += 'r.push(' + line + ');\n';
				}
			} else {
				code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '';
			}

			return add;
		}

		while (match = re.exec(template)) {
			add(template.slice(cursor, match.index))(match[1], true);
			cursor = match.index + match[0].length;
		}

		add(template.substr(cursor, template.length - cursor));

		code += 'return r.join("");';
		return new Function(' with (this) { ' + code.replace(/[\r\t\n]/g, '') + '}').apply(json);
	}

	static formToJSON(form) {
		var elements = {};
		var $form = $(form);

		$form.find('input, select, textarea').each(function () {
			var $element = $(this);
			var name = $element.attr('name')
			var type = $element.attr('type')
			if (name) {
				var $value;
				if (type == 'radio') {
					$value = $('input[name=' + name + ']:checked', $form).val();
				} else if (type == 'checkbox') {
					$value = $element.is(':checked');
				} else {
					$value = $element.val();
				}

				elements[$element.attr('name')] = $value
			}
		});

		return elements;
	}

	static formFromJSON(form, data) {
		var $form = $(form);

		$.each(data, function (key, value) {
			var $element = $('[name="' + key + '"]', $form);
			var type = $element.first().attr('type');

			if (type == 'radio') {
				$('[name="' + key + '"][value="' + value + '"]').prop('checked', true);
			} else if (type == 'checkbox' && (value == true || value == 'true')) {
				$('[name="' + key + '"]').prop('checked', true);
			} else {
				$element.val(value);
			}
		});
	}


	static hyphenToCamelCase(hyphen) {
		return hyphen.replace(/-([a-z])/g, function (match) {
			return match[1].toUppercase();
		});
	}

	static camelCaseToHyphen(camelCase) {
		return camelCase.replace(/[A-Z]/g, '-$1').toLowerCase();
	}

	static rgb2hex(rgb) {
		if (/^#[0-9A-F]{6}$/i.test(rgb)) return rgb;

		rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
		if (!rgb)
			return '';

		function hex(x) {
			return ("0" + parseInt(x).toString(16)).slice(-2);
		}
		return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
	}

	static genId(length) {
		length = length ? length : 8;
		var result = '';
		var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		var charactersLength = characters.length;
		for (var i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	}

}
