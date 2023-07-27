/**
 * PERHATIAN!!!
 * Generator mock adalah SECOND CLASS CITIZEN dalam source code ini.
 * Source of thruth ada pada file-file mock di direktori mocks.
 * Implementasi generator mock ini harus disesuaikan dengan file-file di direktori mocks.
 * Setiap kali run generator WAJIB cek apakah hasil file-file yang di-generate sesuai dengan spesifikasi.
 */

const { GET, generateMocks, POST } = require('./mock-file.js');
const { userRepo, serviceRepo, therapistRepo, orderRepo, ratingRepo, activityLogRepo, paymentRepo } = require('./mock-models.js');
require('./mock-factory.js');
const { orderSummaryRepo, therapistSummaryRepo } = require('./mock-submodels.js');

const orderStatuses = ['WAITING_CONFIRMATION', 'WAITING_PAYMENT', 'PAID', 'DONE', 'CANCELED', 'EXPIRED'];
const customerUsers = userRepo.items.filter((u) => u.role === 'USER');
const therapistUsers = userRepo.items.filter((u) => u.role === 'THERAPIST');


/** ========== /api/v1/mock/users ========== */

for (const user of customerUsers) {
    GET('api/v1/mock/users/me', { id: user.id }, user);
}
for (const user of therapistUsers) {
    const therapist = therapistRepo.find((t) => t.id === user.id);
    GET('api/v1/mock/users/me', { id: user.id }, {
        ...user,
        therapist,
    });
}
POST('api/v1/mock/users', { role: 'THERAPIST' }, {
    message: 'Success to be therapist',
}, true);
POST('api/v1/mock/users', { role: 'USER' }, {
    message: 'Success to be therapist',
}, false);
POST('api/v1/mock/users', {}, {
    errors: [],
}, false);


/** ========== /api/v1/mock/services ========== */

GET('api/v1/mock/services', {}, serviceRepo.items);
for (const service of serviceRepo.items) {
    GET(`api/v1/mock/services/${service.id}`, {}, service);
}


/** ========== /api/v1/mock/therapists ========== */

GET('api/v1/mock/therapists', {}, therapistSummaryRepo.items);
therapistsSortByPopularity({}, therapistRepo.rawItems);
for (const service of serviceRepo.items) {
    const filteredTherapists = therapistSummaryRepo.items.filter((therapistSummary) => {
        const s = therapistSummary.services.find((s) => s.id === service.id);
        return !!s;
    });
    const filteredRawTherapists = therapistRepo.rawItems.filter((therapist) => {
        return filteredTherapists.find((ts) => ts.id === therapist.id);
    });
    therapistsSortByPopularity({ service_id: service.id }, filteredRawTherapists);
    GET('api/v1/mock/therapists', { service_id: service.id }, filteredTherapists);
}
for (let ratingIndex = 0; ratingIndex < 5; ratingIndex++) {
    const filteredTherapistSummaries = therapistSummaryRepo.items.filter((therapistSummary) => {
        const rating = parseFloat(therapistSummary.rating);
        return rating >= (ratingIndex + 1);
    });
    const filteredRawTherapists = therapistRepo.rawItems.filter((therapist) => {
        return filteredTherapistSummaries.find((ts) => ts.id === therapist.id);
    });
    therapistsSortByPopularity({ rating: ratingIndex + 1 }, filteredRawTherapists);
    GET('api/v1/mock/therapists', { rating: ratingIndex + 1 }, filteredTherapistSummaries);

    for (const service of serviceRepo.items) {
        const filteredTherapists = filteredTherapistSummaries.filter((therapistSummary) => {
            const s = therapistSummary.services.find((s) => s.id === service.id);
            return !!s;
        });
        const filteredRawTherapists = therapistRepo.rawItems.filter((therapist) => {
            return filteredTherapists.find((ts) => ts.id === therapist.id);
        });
        therapistsSortByPopularity({ rating: ratingIndex + 1, service_id: service.id }, filteredRawTherapists);
        GET('api/v1/mock/therapists', { rating: ratingIndex + 1, service_id: service.id }, filteredTherapists);
    }
}
for (const therapist of therapistRepo.items) {
    GET(`api/v1/mock/therapists/${therapist.id}`, {}, therapist);
}


/** ========== /api/v1/mock/orders ========== */

GET('api/v1/mock/orders', {}, orderSummaryRepo.items);
{
    const sortedOrders = orderSummaryRepo.items
        .sort((a, z) => {
            const aTime = new Date(a.created_at).getTime();
            const zTime = new Date(z.created_at).getTime();
            return zTime - aTime;
        });
    GET('api/v1/mock/orders', { user_id: 100, sort_by: 'created_at', sort_dir: 'desc' }, sortedOrders);
}
for (const user of customerUsers) {
    for (const orderStatus of orderStatuses) {
        const filteredOrders = orderSummaryRepo.items.filter((o) => {
            return o.user_id === user.id && o.order_status === orderStatus;
        });
        const sortedOrders = filteredOrders.sort((a, z) => {
            const aTime = new Date(a.created_at).getTime();
            const zTime = new Date(z.created_at).getTime();
            return zTime - aTime;
        });
        GET('api/v1/mock/orders', { user_id: user.id, status: orderStatus, sort_by: 'created_at', sort_dir: 'desc' }, sortedOrders);
    }
    {
        const ongoingStatuses = ['WAITING_CONFIRMATION', 'WAITING_PAYMENT', 'PAID'];
        const filteredOrders = orderSummaryRepo.items.filter((o) => {
            return ongoingStatuses.includes(o.order_status);
        });
        const sortedOrders = filteredOrders.sort((a, z) => {
            const aTime = new Date(a.created_at).getTime();
            const zTime = new Date(z.created_at).getTime();
            return zTime - aTime;
        });
        GET('api/v1/mock/orders', { user_id: user.id, status: ongoingStatuses.join(','), sort_by: 'created_at', sort_dir: 'desc' }, sortedOrders);
    }
    {
        const completedStatuses = ['DONE', 'CANCELED', 'EXPIRED'];
        const filteredOrders = orderSummaryRepo.items.filter((o) => {
            return completedStatuses.includes(o.order_status);
        });
        const sortedOrders = filteredOrders.sort((a, z) => {
            const aTime = new Date(a.created_at).getTime();
            const zTime = new Date(z.created_at).getTime();
            return zTime - aTime;
        });
        GET('api/v1/mock/orders', { user_id: user.id, status: completedStatuses.join(','), sort_by: 'created_at', sort_dir: 'desc' }, sortedOrders);
    }
}
for (const therapist of therapistRepo.items) {
    {
        const filteredOrders = orderSummaryRepo.items.filter((o) => {
            return o.therapist_id === therapist.id;
        });
        const sortedOrders = filteredOrders.sort((a, z) => {
            const aTime = new Date(a.created_at).getTime();
            const zTime = new Date(z.created_at).getTime();
            return zTime - aTime;
        });
        GET('api/v1/mock/orders', { therapist_id: therapist.id, sort_by: 'created_at', sort_dir: 'desc' }, sortedOrders);
    }
    {
        const ongoingStatuses = ['WAITING_CONFIRMATION', 'WAITING_PAYMENT', 'PAID'];
        const filteredOrders = orderSummaryRepo.items.filter((o) => {
            return ongoingStatuses.includes(o.order_status);
        });
        const sortedOrders = filteredOrders.sort((a, z) => {
            const aTime = new Date(a.created_at).getTime();
            const zTime = new Date(z.created_at).getTime();
            return zTime - aTime;
        });
        GET('api/v1/mock/orders', { therapist_id: therapist.id, status: ongoingStatuses.join(','), sort_by: 'created_at', sort_dir: 'desc' }, sortedOrders);
    }
    {
        const completedStatuses = ['DONE', 'CANCELED', 'EXPIRED'];
        const filteredOrders = orderSummaryRepo.items.filter((o) => {
            return completedStatuses.includes(o.order_status);
        });
        const sortedOrders = filteredOrders.sort((a, z) => {
            const aTime = new Date(a.created_at).getTime();
            const zTime = new Date(z.created_at).getTime();
            return zTime - aTime;
        });
        GET('api/v1/mock/orders', { therapist_id: therapist.id, status: completedStatuses.join(','), sort_by: 'created_at', sort_dir: 'desc' }, sortedOrders);
    }
}
for (const user of customerUsers) {
    const filteredOrders = orderSummaryRepo.items.filter((o) => {
        return o.user_id === user.id;
    });
    const sortedOrders = filteredOrders.sort((a, z) => {
        const aTime = new Date(a.created_at).getTime();
        const zTime = new Date(z.created_at).getTime();
        return zTime - aTime;
    });
    GET('api/v1/mock/orders', { user_id: user.id, sort_by: 'created_at', sort_dir: 'desc' }, sortedOrders);
}
for (const order of orderRepo.items) {
    GET(`api/v1/mock/orders/${order.id}`, {}, order);
    // POST(`api/v1/mock/orders/${order.id}/pay`, { payment_method: 'OVO' }, {
    //     message: 'Successfully select payment method.',
    // }, true);
    // POST(`api/v1/mock/orders/${order.id}/pay`, { payment_method: 'DANA' }, {
    //     message: 'Successfully select payment method.',
    // }, false);
    // POST(`api/v1/mock/orders/${order.id}/pay`, { payment_method: 'RUPIAH_DIGITAL' }, {
    //     message: 'Successfully select payment method.',
    // }, false);
    if (order.order_status === 'WAITING_CONFIRMATION') {
        POST(`api/v1/mock/orders/${order.id}/cancel`, {}, {
            message: 'Successfully cancel order.',
        }, true);
        POST(`api/v1/mock/orders/${order.id}/accept`, {}, {
            message: 'Successfully accept appointment.',
        }, true);
    }
    // if (order.order_status === 'WAITING_PAYMENT') {

    // }
    if (order.order_status === 'PAID') {
        POST(`api/v1/mock/orders/${order.id}/start_timer`, {}, {
            message: 'Successfully start appointment time.',
        }, true);
        POST(`api/v1/mock/orders/${order.id}/pause_timer`, {}, {
            message: 'Successfully pause appointment time.',
        }, true);
        POST(`api/v1/mock/orders/${order.id}/end_timer`, {}, {
            message: 'Successfully end appointment time.',
        }, true);
    }
}
POST('api/v1/mock/orders', {
    therapist_id: '1',
    service_id: '1',
    appointment_date: '2023-07-30',
    appointment_time: '14:00',
    appointment_duration: '90',
    note: '',
}, {
    message: 'Success to be therapist',
    data: {
        id: 101,
        uid: 'LK2TR4W0',
        user_id: 100,
        user_avatar: '{{MOCK_URL}}/static/images/user-avatar-1.png',
        therapist_id: 1,
        service_id: 1,
        service_name: 'Deep Tissue Massage',
        service_description: 'Deep Tissue Massage adalah terapi pijat yang menargetkan kelompok otot dan jaringan ikat yang lebih dalam. Tujuannya adalah meredakan nyeri dan ketegangan otot kronis, meningkatkan rentang gerak, dan memperbaiki postur. Terapis menggunakan tekanan kuat untuk menjangkau lapisan yang lebih dalam dari otot dan jaringan ikat. Sesinya biasanya berlangsung antara 60 hingga 90 menit',
        order_status: 'WAITING_CONFIRMATION',
        appointment_date: '2023-07-20T10:00:00+07:00',
        appointment_duration: 90,
        total_price: 750000,
        note: '',
        location: {
            x: -7,
            y: 110.5,
        },
        created_at: '2023-07-15T00:00:00+07:00',
        updated_at: '2023-07-15T00:00:00+07:00',
    },
}, true);


/** ========== /api/v1/mock/ratings ========= */

for (const therapist of therapistRepo.items) {
    const filteredRatings = ratingRepo.items.filter((r) => {
        const o = orderRepo.items.find((o) => o.id === r.order_id);
        return o.therapist_id === therapist.id;
    });
    const sortedRatings = filteredRatings.sort((a, z) => {
        const aTime = new Date(a.created_at).getTime();
        const zTime = new Date(z.created_at).getTime();
        return zTime - aTime;
    });
    GET('api/v1/mock/ratings', { therapist_id: therapist.id, sort_by: 'created_at', sort_dir: 'desc' }, sortedRatings);
}
POST('api/v1/mock/ratings', {
    order_id: '100',
    rating: '5',
    note: 'OK',
}, {
    message: 'Successfully submitted rating.',
}, true);
POST('api/v1/mock/ratings', {}, {
    errors: [],
}, false);


/** ========== /api/v1/mock/activity_histories ========= */

for (const user of userRepo.items) {
    const filteredActivityLogs = activityLogRepo.items.filter((al) => {
        return al.user_id === user.id;
    });
    const sortedActivityLogs = filteredActivityLogs.sort((a, z) => {
        const aTime = new Date(a.created_at).getTime();
        const zTime = new Date(z.created_at).getTime();
        return zTime - aTime;
    });
    GET('api/v1/mock/activity_histories', { user_id: user.id, sort_by: 'created_at', sort_dir: 'desc' }, sortedActivityLogs);
}


/** ========== /api/v1/mock/payment_methods ========= */

GET('api/v1/mock/payment_methods', {}, [
    {
        key: 'OVO',
        label: 'OVO Payment',
        icon: '{{MOCK_URL}}/static/images/payment-method-ovo.png',
    },
    {
        key: 'DANA',
        label: 'DANA Payment',
        icon: '{{MOCK_URL}}/static/images/payment-method-dana.png',
    },
    {
        key: 'RUPIAH_DIGITAL',
        label: 'BIDR Crypto',
        icon: '{{MOCK_URL}}/static/images/payment-method-bidr.png',
    },
]);


/** ========== /api/v1/mock/payments ========= */

for (const user of therapistUsers) {
    const filteredPayments = paymentRepo.items.filter((p) => {
        const order = orderRepo.find((o) => o.id === p.order_id);
        const therapist = therapistRepo.find((t) => t.id === order.therapist_id);
        return therapist.user_id === user.id;
    });
    const sortedPayments = filteredPayments.sort((a, z) => {
        const aTime = new Date(a.created_at).getTime();
        const zTime = new Date(z.created_at).getTime();
        return zTime - aTime;
    });
    GET('api/v1/mock/payments', { user_id: user.id, sort_by: 'created_at', sort_dir: 'desc' }, sortedPayments);
}

generateMocks();





function therapistsSortByPopularity(query, rawTherapists) {
    const sortedRawTherapists = rawTherapists
        .sort((a, z) => {
            return z.review_total - a.review_total;
        });
    const sortedTherapists = sortedRawTherapists
        .map((rawTherapist) => {
            return therapistSummaryRepo.find((ts) => ts.id === rawTherapist.id);
        });
    GET('api/v1/mock/therapists', { ...query, sort_by: 'popularity', sort_dir: 'desc' }, sortedTherapists);
}
