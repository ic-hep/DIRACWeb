var gLeftSidebarPanel = false //Sidebar panel

function initAccounting(){

  Ext.onReady(function(){
    renderPage();
  });
}

function renderPage(){
  var leftBar = createLeftSelectPanel( "TEST", "ajaxCall", parseLeftPanelSelections, useMeRest );
  var mainContent = new Ext.Panel( { html : '', region : 'center' } );
  appendToLeftPanel( createComboBox( "comboName", "LAAAABEL", "Select me!", [ [1,'ad' ], [2,'bd'] ] ) );
  appendToLeftPanel( createDateField( "dateName", "TIIIME" ) );
  appendToLeftPanel( createNumberField( "numberField", "NUUUMBER", "" ) );
  appendToLeftPanel( createCheckBox( "check1", "LAAAABEL", 2 ) );
  appendToLeftPanel( createRadioBox( "radio1", "LAAAABEL", "radi1value" ) );
  appendToLeftPanel( createRadioBox( "radio2", "LAAAABEL", "radio2vaue" ) );
  appendToLeftPanel( createRadioBoxPanel( 'radiopanel', "Group by", [ [ 'country', 'By country' ], [ 'grid', 'By grid' ] ] ) );
  appendToLeftPanel( createCheckBoxPanel( 'checkpanel', "Sort by", [ [ 'country', 'By country' ], [ 'grid', 'By grid' ] ] ) );
  appendToLeftPanel( createTextField( 'textField', 'Get some text!', 'Type here!' ) );

  renderInMainViewport([ leftBar, mainContent ]);
}

/* == LEFT PANEL MAGIC == */

function createLeftSelectPanel( panelTitle, submitURL, cbParseSelection , cbSuccessCallback )
{
  gLeftSidebarPanel = new Ext.FormPanel( {
    labelAlign : 'top',
    split : true,
    region : 'west',
    collapsible : true,
    width : 200,
    minWidth : 200,
    margins : '2 0 2 2',
    cmargins : '2 2 2 2',
    layoutConfig : { border : true,
                     animate : true
                   },
    bodyStyle : 'padding: 5px',
    title : panelTitle,
    buttonAlign : 'center',
    waitMsgTarget : true,
    autoScroll : true,
    url : submitURL,
    userCBParseSelection : cbParseSelection,
    userCBSuccessAJAXCallback : cbSuccessCallback,
    method : 'POST',
    items : [ { layout : 'form',
                border : false,
                buttons : [ { text: 'Submit',
                              handler : cbLeftPanelAJAXSubmitHandler,
                            },
                            { text: 'Reset',
                              handler: cbLeftPanelResetHandler,
                            }
                          ]
              }
            ]
  } )
  return gLeftSidebarPanel;
}

function cbLeftPanelResetHandler( submitButton, clickEvent )
{
	gLeftSidebarPanel.form.reset();
}

function cbLeftPanelAJAXSubmitHandler( submitButton, clickEvent )
{
	gLeftSidebarPanel.form.submit( {
		params : gLeftSidebarPanel.userCBParseSelection(),
		waitTitle : 'Updating...',
		waitMsg : 'Loading...',
		success : function( panel, ajaxEvent )
			{
				if( ajaxEvent.result.success )
					alert( "Error in request: " + ajaxEvent.result.error );
				else
					gLeftSidebarPanel.userCBSuccessAJAXCallback( panel, ajaxEvent );
			},
		failure : function( panel, ajaxEvent )
			{
				alert( 'Error: ' + ajaxEvent.response.statusText );
			}
		} );
}

function appendToLeftPanel( extElement )
{
	return gLeftSidebarPanel.insert( gLeftSidebarPanel.items.length - 1, extElement );
}

/* == END OF LEFT PANEL MAGIC == */

/* == SELECTION TO JSON == */

function parseLeftPanelSelections( rootElement )
{
	var numChildren = 0;
	if( ! rootElement )
	{
		rootElement = gLeftSidebarPanel;
		numChildren = gLeftSidebarPanel.items.length - 1;
	}
	else
		numChildren = rootElement.items.length;

	var contents = {};
	console.group( "parseSelections " + rootElement.name + " " + numChildren );
	for( var iEl = 0; iEl < numChildren; iEl ++ )
	{
		var currentEl = rootElement.getComponent( iEl );
		if( currentEl.items )
		{
			var subContents = parseLeftPanelSelections( currentEl );
			for( name in subContents )
				contents[ name ] = subContents[ name ];
		}
		else if( currentEl.isDirty() )
		{
			contents[ currentEl.name ] = currentEl.getValue();
			console.log( currentEl.name +"="+ currentEl.getValue() );
		}
	}
	console.info( contents );
	console.groupEnd();
	return contents;
}

/* == END SELECTION TO JSON == */

/* == START OF WIDGETS == */

function createComboBox( elName, elLabel, elEmpyTextValue, dataStore )
{
	var comboBox = new Ext.form.ComboBox( {
    	anchor : '90%',
    	allowBlank : true,
    	emptyText : elEmpyTextValue,
    	fieldLabel: elLabel,
    	hiddenName : elName,
    	mode : 'local',
    	name : elName,
    	selectOnFocus : true,
    	forceSelection : true,
    	store : dataStore,
    	triggerAction : 'all',
    	typeAhead : true
  } );

  return comboBox;
}

function createCheckBoxPanel( elName, elLabel, elValues )
{
	var panelItems = []
	for( var i = 0; i < elValues.length; i++ )
	{
		panelItems.push( createCheckBox( elName + "." + elValues[i][1], elValues[i][1], elValues[i][0] ) );
	}
	console.log( panelItems );

	var radioPanel = new Ext.form.FieldSet( {
		anchor : '90%',
		title : elLabel,
		name : elName,
		collapsible : true,
		autoHeight : true,
		collapsed : false,
		triggerAction : 'all',
		items : panelItems,
	} );

	return radioPanel;
}

function createCheckBox( elName, elLabel, elValue )
{
	var checkBox = new Ext.form.Checkbox( {
    	anchor : '90%',
    	boxLabel: elLabel,
    	hiddenName : elName,
    	hideLabel : true,
    	name : elName,
    	selectOnFocus : true,
    	triggerAction : 'all',
    	value : elValue
  } );

  return checkBox;
}

function createRadioBoxPanel( elName, elLabel, elValues )
{
	var panelItems = [];
	for( var i = 0; i < elValues.length; i++ )
	{
		panelItems.push( createRadioBox( elName, elValues[i][1], elValues[i][0] ) );
	}
	console.log( panelItems );

	var radioPanel = new Ext.form.FieldSet( {
		anchor : '90%',
		title : elLabel,
		name : elName + "-autopanel",
		collapsible : true,
		autoHeight : true,
		collapsed : false,
		triggerAction : 'all',
		items : panelItems,
	} );

	return radioPanel;
}

function createRadioBox( elName, elLabel, elValue )
{
	var radioBox = new Ext.form.Radio( {
    	anchor : '90%',
    	boxLabel: elLabel,
    	hiddenName : elName,
    	hideLabel : true,
    	name : elName,
    	selectOnFocus : true,
    	triggerAction : 'all',
    	value : elValue
  } );

  return radioBox;
}

function createDateField( elName, elLabel )
{
	var dateField = new Ext.form.DateField( {
		anchor : '90%',
		allowBlank : true,
		emptyText : 'YYYY-mm-dd',
		fieldLabel : elLabel,
		format : 'Y-m-d',
		name : elName,
		selectOnFocus : true,
		startDay : 1
  } );
  return dateField;
}

function createNumberField( elName, elLabel, elDefaultValue )
{
	var numberField = new Ext.form.NumberField( {
		anchor : '90%',
		allowBlank : true,
		allowDecimals : false,
		allowNegative : false,
 		emptyText : elDefaultValue,
		fieldLabel : elLabel,
		mode : 'local',
		name : elName,
		selectOnFocus : true
  } );
  return numberField;
}

function createTextField( elName, elLabel, elDefaultValue )
{
	var textField = new Ext.form.TextField( {
		anchor : '90%',
		allowBlank : true,
 		emptyText : elDefaultValue,
		fieldLabel : elLabel,
		mode : 'local',
		name : elName,
		selectOnFocus : true
  } );
  return textField;
}

/* == END OF WIDGETS == */

function useMeRest( panel, ajaxEvent )
{
	console.log( ajaxEvent );
}