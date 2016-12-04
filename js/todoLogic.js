(function() {
	'use strict';

	var todoLogic = {

		__name: 'TodoLogic',

		/**
		 * TODOモデル
		 */
		model: TodoMVC.TodoModel,

		/**
		 * 一覧表示用ObservableArray
		 */
		todos: h5.core.data.createObservableArray(),

		allStatus: localStorage.getItem('allStatus'),

		/**
		 * サーバからTODOデータを取得します。
		 * <p>
		 * ※今回はjsonファイルのサンプルデータを読み込んでいます。
		 *
		 * @returns {Promise} Promiseオブジェクト
		 */
		init: function() {
			var df = this.deferred();

			var todoArray = this._getLocalStorage() === null ? new Array() : this._getLocalStorage();
			var dataItems = this.model.create(todoArray);
			this.todos.copyFrom(dataItems);
			df.resolve(this.todos);

			return df.promise();
		},
		/**
		 * 指定されたIDに紐づくデータアイテムを取得します。
		 *
		 * @return {DataItem} TODOデータアイテム
		 */
		getItem: function(id) {
			return this.model.get(id);
		},
		/**
		 * ToDoモデルにデータの登録し、一覧表示用ObservableArrayにデータアイテムを追加します。
		 *
		 * @param content {String} TODO内容
		 */
		add: function(content) {
			var item = this.model.create({
				id: this._getNewId(),
				status: false,
				content: content
			});

			this.addLocalStorage(item);
			this.todos.push(item);
			this._completeCheck();
		},
		/**
		 * add data to localStorage。
		 *
		 * @param dataItem
		 */
		addLocalStorage: function(dataItem) {
			dataItem = dataItem.get();
			delete dataItem.checked;
			delete dataItem.contentStyle;
			delete dataItem.contentColor;

			var arr = this._getLocalStorage() === null ? new Array() : this._getLocalStorage();
			arr.push(dataItem);
			localStorage.setItem('todoList', JSON.stringify(arr));
		},
		/**
		 * 指定されたアイテムIDに紐づくデータアイテムをモデルから削除します。
		 *
		 * @param id {Number} アイテムID
		 */
		remove: function(id) {
			for (var i = 0, len = this.todos.length; i < len; i++) {
				var item = this.todos.get(i);
				var itemId = item.get('id');

				if (itemId === id) {
					this.model.remove(id);
					this.todos.splice(i, 1);
					this.removeLocalStorage(id);
					break;
				}								
			}

			this._completeCheck();
		},
		/**
		 * delete data from localStorage
		 *
		 * @param dataId {Number} アイテムID
		 */
		removeLocalStorage: function(dataId) {
			var arr = this._getLocalStorage();
			for (var i = 0; i < arr.length; i++) {
				if (arr[i].id === dataId) {
					arr.splice(i, 1);
				}
			}
			localStorage.setItem('todoList', JSON.stringify(arr));
		},
		/**
		 * 指定されたアイテムIDに紐づくデータアイテムを更新します。
		 *
		 * @param id {Number} アイテムID
		 * @param data {Object} 更新データ
		 */
		update: function(id, data) {
			var item = this.model.get(id);
			item.set(data);

			for (var i = 0; i < this.todos.length; i++) {
				if (this.todos.get(i).get('id') === id) {
					this.todos.splice(i, 1, item);
					break;
				}
			}
			
			this.updateLocalStorage(id, item);
			this._completeCheck();
		},
		/**
		 * 指定されたアイテムIDに紐づくデータアイテムを更新します。
		 *
		 * @param id {Number} アイテムID
		 * @param data {Object} 更新データ
		 */
		updateLocalStorage: function(id, item) {
			var arr = this._getLocalStorage();
			item = item.get();
			delete item.checked;
			delete item.contentStyle;
			delete item.contentColor;

			for (var i = 0; i < arr.length; i++) {
				if (arr[i].id === id) {
					arr.splice(i, 1, item);
				}
			}
			localStorage.setItem('todoList', JSON.stringify(arr));
		},
		/**
		 * アイテムIDを採番します。
		 *
		 * @returns {Number} アイテムID
		 */
		_getNewId: function() {
			for (var i = 1;; i++) {
				if (!this.model.has(i)) {
					return i;
				}
			}
		},
		/**
		 * All tasks completed
		 *
		 * @returns {Number} アイテムID
		 */
		checkAll: function(checked) {
			for (var i = 0; i < this.todos.length; i++) {
				if (this.todos.get(i).get('status') != checked) {
					this.update(this.todos.get(i).get('id'), {status: checked});
				}				
			}
		},
		/**
		 * retrieve localStorage array
		 */
		_getLocalStorage: function() {
			return JSON.parse(localStorage.getItem('todoList'));
		},
		/**
		 * retrive localStorage array
		 */
		_completeCheck: function() {
			this.allStatus = 'true';

			for (var i = 0; i < this.todos.length; i++) {
				if (this.todos.get(i).get('status') != true) {
					this.allStatus = 'false';
					break;
				}
			}

			localStorage.setItem('allStatus', this.allStatus);
		}
	};
	
	// sample.todo.logic.ToDoLogicでグローバルに公開する
	h5.core.expose(todoLogic);
})();