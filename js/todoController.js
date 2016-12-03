(function() {
	'use strict';

	var todoController = {

		__name: 'TodoController',
		
		todoLogic: TodoLogic,

		/**
		 * TODOリストのデータをサーバから取得し画面に表示します。
		 * <p>
		 * ※今回はJSONファイルからサンプルデータを取得しています。
		 */
		__ready: function() {
			var that = this;

			this.todoLogic.init().done(function(data) {
				that.view.bind('h5view#tmplTodos', {
					todos: data
				});

				if (data.length > 0) {
					that.$find('#main').css('display', 'block');
				}

				that._setToggleStatus();
			});
		},
		/**
		 * TODOのテキストボックスでエンターキーが押下されたときの処理
		 * <p>
		 * テキストに入力されたTODOの内容をデータモデルに登録します。
		 *
		 * @param {Object} context イベントコンテキスト
		 */
		'#submitForm submit': function(context) {
			this._insertToDo(context);
			this._setToggleStatus();
		},
		/**
		 * TODOリスト一覧のチェックボックスが操作されたときの処理
		 * <p>
		 * チェックまたは未チェックによって、データアイテムのステータスを更新します。
		 *
		 * @param {Object} context イベントコンテキスト
		 *
		 * @param $el イベントターゲット要素
		 */
		'#todo-list li input[type="checkbox"] click': function(context, $el) {
			var id = this._getSelectedItemId($el.closest('div'));
			var checked = $el[0].checked;

			this.todoLogic.update(parseInt(id), {
				status: checked
			});

			this._setToggleStatus();

			context.event.stopPropagation();
		},
		/**
		 * complete all button click
		 * 
		 * @param {Object} context イベントコンテキスト
		 *
		 * @param $el イベントターゲット要素
		 */
		'#toggle-all click': function(context, $el) {
			var checked = $el[0].checked;

			this.todoLogic.checkAll(checked);
			this._setToggleStatus();

			context.event.stopPropagation();
		},
		/**
		 * 削除ボタンが押下されたときの処理
		 * <p>
		 * 詳細画面に表示されているTODOデータを削除します。
		 *
		 * @param {Object} context イベントコンテキスト
		 *
		 * @param $el イベントターゲット要素
		 */
		'.destroy click': function(context, $el) {
			this._destroyLine($el);

			// formのsubmitが動作しないよう伝播を止める
			context.event.stopPropagation();
		},
		/**
		 * content editing
		 *
		 * @param {Object} context イベントコンテキスト
		 *
		 * @param $el イベントターゲット要素
		 */
		'#todo-list label dblclick': function(context, $el) {
			var target = $el.closest('li').addClass('editing');
			target.find('.edit').focus();
		},
		/**
		 * input lose focus
		 *
		 * @param {Object} context イベントコンテキスト
		 *
		 * @param $el イベントターゲット要素
		 */
		'.edit focusout': function(context, $el) {
			if ($el.val().trim() === '') {
				return;
			} else {
				this._editData($el);
			}
		},
		/**
		 * key up event
		 *
		 * @param {Object} context イベントコンテキスト
		 *
		 * @param $el イベントターゲット要素
		 */
		'.edit keyup': function(context, $el) {
			var ENTER_KEY = 13;
			var ESCAPE_KEY = 27;

			if (context.event.which === ENTER_KEY || 
				context.event.which === ESCAPE_KEY) {
				if ($el.val().trim() === '') {
					this._destroyLine($el);
				} else {
					$el.closest('li').removeClass('editing');
				}
			}
		},
		/**
		 * TODOデータの登録処理を行います。
		 *
		 * @param {Object} ctx イベントコンテキスト
		 */
		_insertToDo: function(ctx) {
			var $txtTodo = this.$find('#new-todo');

			if ($txtTodo.val().trim() === '') {
				alert('TODOを入力して下さい。');
			} else {
				this.todoLogic.add($txtTodo.val().trim());
				$txtTodo.val('');
				this.$find('#main').css('display', 'block');
			}

			// formのsubmitが動作しないよう伝播を止める
			ctx.event.preventDefault();
		},
		/**
		 * 一覧で選択された行のアイテムIDを取得します。
		 *
		 * @param targetElem {DOMElement} イベント発生要素
		 * @returns アイテムID
		 */
		_getSelectedItemId: function(targetElem) {
			return $(targetElem).find(	'input[data-h5-bind="id"]').val();
		},
		/**
		 * set toggle-all button status
		 */
		_setToggleStatus: function() {			
			if (this.todoLogic.allStatus === 'true') {
				(this.$find('#toggle-all'))[0].checked = true;
				this.$find('#toggle-all').css('color', '');
			} else {
				(this.$find('#toggle-all'))[0].checked = false;
				this.$find('#toggle-all').css('color', '#e6e6e6');
			}
		},
		/**
		 * data edit
		 * @param $el イベントターゲット要素
		 */
		_editData: function($el) {
			var id = this._getSelectedItemId($el.closest('li'));
			var data = $el.val().trim();

			this.todoLogic.update(parseInt(id), {
				content: data
			});

			$el.closest('li').removeClass('editing');
		},
		/**
		 * delete a line
		 * @param $el イベントターゲット要素
		 */
		_destroyLine: function($el) {
			var id = this._getSelectedItemId($el.closest('li'));

			this.todoLogic.remove(parseInt(id));

			if (this.todoLogic.todos.length === 0) {
				this.$find('#main').css('display', 'none');
			}

			this._setToggleStatus();
		}
	};

	// sample.todo.controller.ToDoControllerでグローバルに公開する
	h5.core.expose(todoController);
})();
