import React, { ReactElement } from 'react';
import { FaDiscord } from 'react-icons/fa';

import 'pages/dashboard/dashboard-subpage.scss';
import 'pages/dashboard/dashboard.page.scss';

export default function FeedbackPage(): ReactElement {
  return (
    <div className='main-container dashboard-page'>
      <div className='title-container mb-3'>
        <div className='title-text-container'>
          <h1 className='title-text'>Feedback</h1>
        </div>
      </div>
      <div className='row'>
        <div className='col-lg-8 offset-lg-2'>
          <div className='row'>
            <div className='col-lg-4 mb-3'>
              <div
                className='card'
                style={{ minHeight: '100px' }}>
                <div className='card-body text-center'>
                  <a
                    className='nav-link'
                    href='https://forms.gle/JXBoRdspbG8pMs3k6'
                    target='_blank'
                    rel='noopener noreferrer'>
                    <h1 style={{ fontSize: '1.3em' }}>
                                            User Feedback Form <span className='fa fa-external-link'></span>{' '}
                    </h1>
                  </a>
                </div>
              </div>
            </div>
            <div className='col-lg-4 mb-3'>
              <div
                className='card'
                style={{ minHeight: '100px' }}>
                <div className='card-body text-center'>
                  <a
                    className='nav-link'
                    href='https://forms.gle/zzKhaEzttCKksjej7'
                    target='_blank'
                    rel='noopener noreferrer'>
                    <h1 style={{ fontSize: '1.3em' }}>
                                            Vault Feedback Form <span className='fa fa-external-link'></span>{' '}
                    </h1>
                  </a>
                </div>
              </div>
            </div>
            <div className='col-lg-4 mb-3'>
              <div
                className='card'
                style={{ minHeight: '100px' }}>
                <div className='card-body text-center'>
                  <a
                    className='nav-link'
                    href='https://forms.gle/hriZNJ6pSEKHzwpS7'
                    target='_blank'
                    rel='noopener noreferrer'>
                    <h1 style={{ fontSize: '1.3em' }}>
                                            Relayer Feedback Form <span className='fa fa-external-link'></span>{' '}
                    </h1>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className='row mt-3'>
            <div className='col-lg-4 offset-lg-2 mb-3'>
              <div
                className='card'
                style={{ minHeight: '100px' }}>
                <div className='card-body text-center'>
                  <a
                    className='nav-link'
                    href='https://github.com/interlay/polkabtc-ui/issues'
                    target='_blank'
                    rel='noopener noreferrer'>
                    <h1 style={{ fontSize: '1.3em' }}>
                                            Open an Issue on Github <span className='fa fa-github'></span>{' '}
                    </h1>
                  </a>
                </div>
              </div>
            </div>
            <div className='col-lg-4 mb-3'>
              <div
                className='card'
                style={{ minHeight: '100px' }}>
                <div className='card-body text-center'>
                  <a
                    className='nav-link'
                    href='https://discord.gg/KgCYK3MKSf'
                    target='_blank'
                    rel='noopener noreferrer'>
                    <h1 style={{ fontSize: '1.3em' }}>
                                            Discuss on Discord <FaDiscord></FaDiscord>{' '}
                    </h1>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
