/**
 * This provides the definition of the SQL store if used
 */

var SQLStore = require("mysql-store").SQLStore;
//CREATE TABLE Page (id VARCHAR(100), status VARCHAR(10), content VARCHAR(100000), createdBy VARCHAR(20), lastModifiedBy VARCHAR(20), PRIMARY KEY(id))
exports.pageStore = SQLStore({
	table: "Test",
	idColumn: "id"
});
