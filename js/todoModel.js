(function() {
	'use strict';

	// データモデルマネージャを作成する
	var todoManager = h5.core.data.createManager('ToDoManager');

	// データモデルを生成
	var todoModel = todoManager.createModel({
		name: 'TodoModel',
		schema: {
			// ID
			id: {
				id: true,
				type: 'integer'
			},
			// ステータス
			status: {
				type: 'boolean'
			},
			checked: {
				type: 'string',
				depend: {
					on: 'status',
					calc: function() {
						return this.get('status') ? 'checked' : null;
					}
				}
			},
			// 内容
			content: {
				type: 'string'
			},
			// 内容 - スタイル
			contentStyle: {
				type: 'string',
				depend: {
					on: 'status',
					calc: function() {
						return this.get('status') ? 'line-through' : '';
					}
				}
			},
			// color - スタイル
			contentColor: {
				type: 'string',
				depend: {
					on: 'status',
					calc: function() {
						return this.get('status') ? '#d9d9d9' : '';
					}
				}
			}
		}
	});

	// ToDoModelでグローバルに公開する
	h5.u.obj.expose('TodoMVC', {
		TodoModel: todoModel
	});
	
})();