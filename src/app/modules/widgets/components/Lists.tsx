import React, {FC} from 'react'
import {
  ListsWidget7,
  ListsWidget8,
} from '../../../../_metronic/partials/widgets'

const Lists: FC = () => {
  return (
    <>
      {/* begin::Row */}
      <div className='row g-5 g-xl-8'>
        <div className='col-xl-6'>
          <ListsWidget7 className='card-xl-stretch mb-xl-8' />
        </div>
        <div className='col-xl-6'>
          <ListsWidget8 className='card-xl-stretch mb-5 mb-xl-8' />
        </div>
      </div>
      {/* end::Row */}
    </>
  )
}

export {Lists}
