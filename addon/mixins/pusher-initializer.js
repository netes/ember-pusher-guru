import Ember from 'ember';
const { inject } = Ember;

export default Ember.Mixin.create({
  pusher: inject.service(),

  init() {
    this._super(...arguments);
    this.get('pusher').on('newEvent', this, this._handleEvent);
  },

  willDestroy() {
    this.get('pusher').off('newEvent', this, this._handleEvent);
  },

  _handleEvent(event, data) {
    const method = this._getEventMethodName(event);
    if (this[method] && this[method].apply) {
      this[method](data);
    }
  },

  _getEventMethodName(event) {
    const result = this.get('pusherActions').find((connection) => {
      return Object.keys(connection)[0] === event;
    });
    return result && result[event];
  }
});
