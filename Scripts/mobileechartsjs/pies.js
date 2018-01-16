
var EchartsPieComponent = {};

//饼图 ItemName,ItemCount
EchartsPieComponent.Pie001 = function (data, optionatt) {
    this._tableData = data;
//    if (this._tableData.length <= 0) {
//        return null;
//    }
    var legendvalue = new Array();
    var seriesdata = new Array();

    for (var i = 0; i < this._tableData.length; i++) {
        if (!legendvalue.contains(this._tableData[i].ItemName.toString())) {
            legendvalue.push(this._tableData[i].ItemName.toString());
        }
    }

    for (var i = 0; i < legendvalue.length; i++) {
        var itemcount = 0;
        for (var j = 0; j < this._tableData.length; j++) {
            if (this._tableData[j].ItemName.toString() == legendvalue[i]) {
                itemcount += parseInt(this._tableData[j].ItemCount);
            }
        }
        var tmodel = new SeriesDataModel(legendvalue[i], itemcount);
        seriesdata.push(tmodel);
    }

    if (!optionatt.report.isMobileShowItem) {
        legendvalue.splice(0, legendvalue.length);
    }

    var option = {
        backgroundColor: window._webconfig.mobilebackgroundColor,
        color: window._webconfig.mobilecolor,
        noDataLoadingOption: {
            text: '暂无数据',
            effect: 'bubble',
            effectOption: {
                effect: {
                    n: 0
                }
            }
        },
        title: {
            text: optionatt.Title,
            itemGap: 10,
            textStyle: {
                color: window._webconfig.mobiletextStyle
            },
            subtextStyle: {
                color: window._webconfig.mobilesubtextStyle
            },
            subtext: optionatt.SubTitle,
            x: optionatt.HorizontalType,
            top: 50
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: optionatt.LegendOrient,
            x: optionatt.LegendHorizontalType,
            data: legendvalue,
            top: 50
        },
//        toolbox: {
//            orient: optionatt.ToolBoxOrient,
//            show: true,
//            feature: {
//                mark: { show: true },
//                dataView: { show: true, readOnly: false },
//                magicType: {
//                    show: true,
//                    type: ['pie', 'funnel'],
//                    option: {
//                        funnel: {
//                            x: '25%',
//                            width: '50%',
//                            funnelAlign: 'left',
//                            max: 1548
//                        }
//                    }
//                },
//                restore: { show: true },
//                saveAsImage: { show: true }
//            }
//        },
        calculable: true,
        series: [
        {
            name: '',
            type: 'pie',
            radius: '45%',
            center: ['50%', '60%'],
            data: seriesdata
        }
    ]
    };

    return option;
}


//饼图集 ItemName,ItemCount
EchartsPieComponent.Pie002 = function (data, optionatt) {
    this._tableData = data;
//    if (this._tableData.length <= 0) {
//        return null;
//    }

    var labelTop = {
        normal: {
            label: {
                show: true,
                position: 'center',
                formatter: '{b}',
                textStyle: {
                    baseline: 'bottom'
                }
            },
            labelLine: {
                show: false
            }
        }
    };
    var labelFromatter = {
        normal: {
            label: {
                formatter: function (params) {
                    return (100 - params.value).toFixed(1) + '%'
                },
                textStyle: {
                    baseline: 'top'
                }
            }
        }
    };
    var labelBottom = {
        normal: {
            color: '#ccc',
            label: {
                show: true,
                position: 'center'
            },
            labelLine: {
                show: false
            }
        },
        emphasis: {
            color: 'rgba(0,0,0,0)'
        }
    };
    var radius = [35, 45];

    var legendvalue = new Array();
    var seriesdata = new Array();
    var itemcounttotal = 0;
    for (var i = 0; i < this._tableData.length; i++) {
        itemcounttotal += this._tableData[i].ItemCount;
        if (this._tableData[i].ItemName.toString() != "" && !legendvalue.contains(this._tableData[i].ItemName.toString())) {
            legendvalue.push(this._tableData[i].ItemName.toString());
        }
    }

    for (var l = 0; l < legendvalue.length; l++) {
        var nitemvalue = 0;
        for (var i = 0; i < this._tableData.length; i++) {
            if (this._tableData[i].ItemName.toString() == legendvalue[l]) {
                nitemvalue += parseFloat(this._tableData[i].ItemCount);
            }
        }
        var itemvalue1 = parseFloat(nitemvalue * 100 / itemcounttotal);
        var itemvalue = itemvalue1.toFixed(1);
        var itemdata = new Array();
        var tmodel = new InstrumentSeriesDataModelStyle('other', 100 - itemvalue, labelBottom);
        itemdata.push(tmodel);
        var tmodel = new InstrumentSeriesDataModelStyle(legendvalue[l], itemvalue, labelTop);
        itemdata.push(tmodel);
        var nrowtotal = parseInt((legendvalue.length - 1) / 5) + 1;
        var nrowsplit = parseInt(95 / nrowtotal);
        var nrow = parseInt(l / 5);
        var ncol = l % 5;
        var centerx = ncol * 20 + 10;
        var centery = nrow * nrowsplit + parseInt(nrowsplit / 2);
        if (nrowtotal == 2 && nrow == 0) {
            centery = 30;
        }
        var x = ncol * 20;
        var y = nrow * nrowsplit + 15;
        var datamodel = new InstrumentSeriesDataModel('pie', new Array(centerx + '%', centery + '%'), radius, x + "%", y + "%", labelFromatter, itemdata);
        seriesdata.push(datamodel);
    }
    var option = {
        backgroundColor: window._webconfig.mobilebackgroundColor,
        color: window._webconfig.mobilecolor,
        noDataLoadingOption: {
            text: '暂无数据',
            effect: 'bubble',
            effectOption: {
                effect: {
                    n: 0
                }
            }
        },
        title: {
            text: optionatt.Title,
            itemGap: 10,
            textStyle: {
                color: window._webconfig.mobiletextStyle
            },
            subtextStyle: {
                color: window._webconfig.mobilesubtextStyle
            },
            subtext: optionatt.SubTitle,
            x: optionatt.HorizontalType
        },
        legend: {
            x: 'center',
            y: 'bottom',
            data: legendvalue
        },
//        toolbox: {
//            orient: optionatt.ToolBoxOrient,
//            show: true,
//            feature: {
//                dataView: { show: true, readOnly: false },
//                magicType: {
//                    show: true,
//                    type: ['pie', 'funnel'],
//                    option: {
//                        funnel: {
//                            width: '20%',
//                            height: '30%',
//                            itemStyle: {
//                                normal: {
//                                    label: {
//                                        formatter: function (params) {
//                                            return 'other\n' + params.value + '%\n'
//                                        },
//                                        textStyle: {
//                                            baseline: 'middle'
//                                        }
//                                    }
//                                }
//                            }
//                        }
//                    }
//                },
//                restore: { show: true },
//                saveAsImage: { show: true }
//            }
//        },
        series: seriesdata
    };
    return option;
}



//单个数量 ItemCount
EchartsPieComponent.Pie003 = function (data, optionatt) {
    this._tableData = data;

    var nData = 0;

    if(this._tableData.length > 0){
        nData = parseInt(this._tableData[0].ItemCount);
    }

    var option = {
        backgroundColor: window._webconfig.mobilebackgroundColor,
        color: window._webconfig.mobilecolor,
        noDataLoadingOption: {
            text: '暂无数据',
            effect: 'bubble',
            effectOption: {
                effect: {
                    n: 0
                }
            }
        },
        title: {
            text: nData,
            textStyle: {
                fontWeight: 'normal',
                fontSize: '35',
                color: window._webconfig.mobiletextStyle
            },
            borderWidth: 0,            // 标题边框线宽，单位px，默认为0（无边框）
            padding: 0,
            itemGap: -10,    
            subtext: optionatt.SubTitle,
            subtextStyle: {
                fontSize: '20',
                top:0,
                color: window._webconfig.mobilesubtextStyle
            },
            x: 'center',
            y: 'center'
        },
//        tooltip: {
//            show: false,
//            formatter: '{a} <br/>{b} : {c} ({d}%)'
//        },
        legend: {
            show: false,
            itemGap: 12,
            data: ['01', '02']
        },
        toolbox: {
            show: false,
            feature: {
                mark: {
                    show: true
                },
                dataView: {
                    show: true,
                    readOnly: false
                },
                restore: {
                    show: true
                }
            }
        },
        series: [{
            name: 'Line 1',
            type: 'pie',
            clockWise: true,
            radius: ['50%', '66%'],
            itemStyle: {
                normal: {
                    label: {
                        show: false
                    },
                    labelLine: {
                        show: false
                    }
                }
            },
            hoverAnimation: false,

            data: [{
                value: 80,
                name: '01',
                itemStyle: {
                    normal: {
                        label: {
                            show: false
                        },
                        labelLine: {
                            show: false
                        }
                    }
                }
            }, {
                value: 20,
                name: 'invisible'
            }]
        }
          ]
    }

    return option;
}