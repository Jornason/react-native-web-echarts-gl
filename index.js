/**
 * Created by womkim on 2017/11/6.
 */

import React from 'react'
import PropTypes from 'prop-types'
import { View, WebView, Platform } from 'react-native'

const renderChart = ({ height, option, geoJson }) => `
  var main = document.getElementById('main');
  main.style.height = "${height}px";
  var myChart = echarts.init(document.getElementById('main'));
  if (${JSON.stringify(geoJson)} != {}){
    echarts.registerMap('geoJson', ${JSON.stringify(geoJson)});
  }
  myChart.setOption(${JSON.stringify(option)});
  `

export default class EchartsGL extends React.Component {
  componentWillReceiveProps (nextProps) {
    if (JSON.stringify(this.props.option) !== JSON.stringify(nextProps.option) || this.props.height !== nextProps.height || JSON.stringify(this.props.geoJson) !== JSON.stringify(nextProps.geoJson)) {
      this.echartsgl.injectJavaScript(renderChart({ height: nextProps.height, option: nextProps.option, geoJson: nextProps.geoJson}))
    }
  }

  render () {
    const { height, width, style, source, option, onLoadStart, onLoad, onError, onLoadEnd, onMessage, renderLoading, renderError,geoJson } = this.props
    let chart = renderChart({ height, option, geoJson })
    // console.log(JSON.stringify(chart))
    return <View style={{width, height}}>
      <WebView
        ref={node => { this.echartsgl = node }}
        style={[style, {height, width, backgroundColor: 'transparent'}]}
        injectedJavaScript={chart}
        source={source ? source : Platform.OS === 'android' && !__DEV__ ? { uri:'file:///android_asset/echarts-gl.html' } : require('./echarts-gl.html')}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        scalesPageToFit={true}
        startInLoadingState={false}
        decelerationRate="normal"
        onLoadStart={onLoadStart}
        onLoad={onLoad}
        onError={onError}
        onLoadEnd={onLoadEnd}
        onMessage={onMessage}
        renderLoading={renderLoading}
        renderError={renderError}
        scrollEnabled={false}
      />
    </View>
  }
}

EchartsGL.propTypes = {
  width: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]),
  height: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]),
  style: PropTypes.object,
  source: PropTypes.object,
  option: PropTypes.object.isRequired,
  geoJson: PropTypes.object,  
  onLoadStart: PropTypes.func,
  onLoad: PropTypes.func,
  onError: PropTypes.func,
  onLoadEnd: PropTypes.func,
  onMessage: PropTypes.func,
  renderLoading: PropTypes.func,
  renderError: PropTypes.func
}

EchartsGL.defaultProps = {
  width: 300,
  height: 300,
  geoJson: {}
}
