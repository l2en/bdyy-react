import React, { PureComponent } from 'react';
import { Carousel } from 'antd';
import styles from './Workplace.less';

export default class Workplace extends PureComponent {
  render() {
    return (
      <Carousel className={styles.antCarousel} autoplay>
        <div className={styles.slickTrack}>
          <h3>星期一</h3>
        </div>
        <div className={styles.slickTrack}>
          <h3>星期二</h3>
        </div>
        <div className={styles.slickTrack}>
          <h3>星期三</h3>
        </div>
        <div className={styles.slickTrack}>
          <h3>星期四</h3>
        </div>
      </Carousel>
    );
  }
}
