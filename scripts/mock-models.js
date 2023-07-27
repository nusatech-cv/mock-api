/**
 * @template T
 * @typedef {import('ajv').ValidateFunction<T>} ValidateFunction<T>
 */

/**
 * @template T
 * @typedef {import('ajv/dist/core').JTDDataType<T>} JTDDataType<T>
 */

const { default: Ajv } = require('ajv/dist/ajv');

const ajv = new Ajv();

let serviceIdInc = 1;
const serviceRepo = model({
    type: 'object',
    properties: {
        id: { type: 'number' },
        name: { type: 'string' },
        description: { type: 'string' },
        duration: { type: 'number' },
        minimum_duration: { type: 'number' },
        price_per_hour: { type: 'number' },
        image: { type: 'string' },
        icon: { type: 'string' },
    },
}, (data) => {
    return {
        id: data.id ?? serviceIdInc++,
        name: data.name,
        description: data.description,
        duration: data.duration,
        minimum_duration: data.minimum_duration,
        price_per_hour: data.price_per_hour,
        image: data.image,
        icon: data.icon,
    };
});

let customerUserIdInc = 1;
const userRepo = model({
    type: 'object',
    properties: {
        id: { type: 'number' },
        first_name: { type: 'string' },
        last_name: { type: 'string' },
        email: { type: 'string' },
        google_id: { type: 'string' },
        avatar: { type: 'string' },
        balance: { type: 'number' },
        role: { type: 'string', enum: ['USER', 'THERAPIST', 'ADMIN'] },
        created_at: { type: 'string' },
        updated_at: { type: 'string' },
    },
}, (data) => {
    return {
        id: data.id ?? customerUserIdInc++,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        google_id: data.google_id,
        avatar: data.avatar,
        balance: 0,
        role: data.role,
        created_at: data.created_at,
        updated_at: data.updated_at,
    };
});

let ratingIdInc = 1;
const ratingRepo = model({
    type: 'object',
    properties: {
        id: { type: 'number' },
        order_id: { type: 'number' },
        rating: { type: 'number' },
        note: { type: 'string' },
        created_at: { type: 'string' },
        updated_at: { type: 'string' },
        user_first_name: { type: 'string' },
        user_last_name: { type: 'string' },
        user_avatar: { type: 'string' },
    },
}, (data) => {
    const order = orderRepo.find((order) => order.id === data.order_id);
    const user = userRepo.find((user) => user.id === order.user_id);

    return {
        id: data.id ?? ratingIdInc++,
        order_id: data.order_id,
        rating: data.rating,
        note: data.note,
        created_at: data.created_at,
        updated_at: data.updated_at,
        user_avatar: user.avatar,
        user_first_name: user.first_name,
        user_last_name: user.last_name,
    };
}, (rating) => {
    const order = orderRepo.find((o) => o.id === rating.order_id);
    const therapist = therapistRepo.find((t) => t.id === order.therapist_id);
    const rawTherapist = therapistRepo.rawItems.find((rt) => rt.id === order.therapist_id);

    order.rating = rating.rating;
    order.rating_note = rating.note;

    if (therapist && Array.isArray(therapist.ratings)) {
        therapist.ratings.push(rating);
        therapist.ratings = therapist.ratings.sort((a, z) => {
            const aDate = new Date(a.created_at).getTime();
            const zDate = new Date(z.created_at).getTime();
            return zDate - aDate;
        });

        rawTherapist.rating_total = typeof rawTherapist.rating_total === 'number'
            ?  rawTherapist.rating_total + rating.rating
            : rating.rating;
        rawTherapist.rating_count = typeof rawTherapist.rating_count === 'number'
            ? rawTherapist.rating_count + 1
            : 1;

        therapist.review_total = rawTherapist.rating_count;
        therapist.rating = (rawTherapist.rating_total / rawTherapist.rating_count).toFixed(2);
    }
    else {
        throw new Error(`Therapist not found on rating: ${JSON.stringify(rating)}`);
    }

    activityLogRepo.create({
        user_id: order.user_id,
        activity_type: 'Submit a Review',
        device_info: 'Redmi Note 10 Pro',
        ip_address: '36.80.171.248',
        location: 'Semarang, Indonesia',
        result: '',
        created_at: rating.created_at,
        updated_at: rating.updated_at,
    });
});

let therapistIdInc = 1;
const therapistRepo = model({
    type: 'object',
    properties: {
        id: { type: 'number' },
        user_id: { type: 'number' },
        first_name: { type: 'string' },
        last_name: { type: 'string' },
        location: {
            type: 'object',
            properties: {
                x: { type: 'number' },
                y: { type: 'number' },
            },
        },
        experience_years: { type: 'number' },
        photo: { type: 'string' },
        age: { type: 'number' },
        gender: { type: 'string' },
        is_available: { type: 'string' },
        rating: { type: 'string' },
        client_total: { type: 'number' },
        review_total: { type: 'number' },
        start_day: { type: 'number' },
        end_day: { type: 'number' },
        start_time: { type: 'string' },
        end_time: { type: 'string' },
        services: { type: 'array', items: serviceRepo.schema },
        ratings: { type: 'array', items: ratingRepo.schema },
    },
}, (data) => {
    const id = data.id ?? therapistIdInc++;
    userRepo.create({
        id,
        first_name: data.first_name,
        last_name: data.last_name,
        email: `therapist_${id}@nusatech.id`,
        avatar: data.photo,
        balance: 0,
        google_id: `GOOGLE_ID_OF_THERAPIST_${id}`,
        role: 'THERAPIST',
        created_at: data.created_at,
        updated_at: data.updated_at,
    });
    return {
        id,
        user_id: id,
        first_name: data.first_name,
        last_name: data.last_name,
        location: data.location,
        experience_years: data.experience_years,
        photo: data.photo,
        age: data.age,
        gender: data.gender,
        is_available: data.is_available,
        rating: data.rating,
        client_total: data.client_total,
        review_total: data.review_total,
        start_day: data.start_day,
        end_day: data.end_day,
        start_time: data.start_time,
        end_time: data.end_time,
        created_at: data.created_at,
        updated_at: data.updated_at,
        services: Array.isArray(data.services) ? data.services.map(serviceRepo.validate) : [],
        ratings: Array.isArray(data.ratings) ? data.ratings.map(ratingRepo.validate) : [],
    };
});

let orderIdInc = 1;
const orderRepo = model({
    type: 'object',
    properties: {
        id: { type: 'number' },
        uid: { type: 'string' },
        user_id: { type: 'number' },
        user_avatar: { type: 'string' },
        therapist_id: { type: 'number' },
        service_id: { type: 'number' },
        service_name: { type: 'string' },
        service_description: { type: 'string' },
        order_status: { type: 'string' },
        appointment_date: { type: 'string' },
        appointment_duration: { type: 'string' },
        total_price: { type: 'number' },
        note: { type: 'string' },
        location: {
            type: 'object',
            properties: {
                x: { type: 'number' },
                y: { type: 'number' },
            },
        },
        created_at: { type: 'string' },
        updated_at: { type: 'string' },
        payment_method: { type: 'string' },
        payment_status: { type: 'string' },
        sender_account: { type: 'string' },
        rating: { type: 'number' },
        rating_note: { type: 'string' },
    },
}, (data) => {
    const service = serviceRepo.find((s) => {
        return s.id === data.service_id;
    });

    if (!service) {
        throw new Error(`Service not found on order: ${JSON.stringify(data)}`);
    }

    const user = userRepo.find((u) => {
        return u.id === data.user_id;
    });

    if (!user) {
        throw new Error(`User not found on order: ${JSON.stringify(data)}`);
    }

    return {
        id: data.id ?? orderIdInc++,
        uid: (new Date(data.created_at)).getTime().toString(36).toUpperCase(),
        user_id: data.user_id,
        user_avatar: user.avatar,
        therapist_id: data.therapist_id,
        service_id: data.service_id,
        service_name: service.name,
        service_description: service.description,
        order_status: data.order_status,
        appointment_date: data.appointment_date,
        appointment_duration: data.appointment_duration,
        total_price: Math.round(service.price_per_hour * (data.appointment_duration / 60)),
        note: data.note ?? '',
        location: data.location,
        created_at: data.created_at,
        updated_at: data.updated_at,
        payment_method: data.payment_method ?? undefined,
        payment_status: data.payment_status ?? undefined,
        sender_account: data.sender_account ?? undefined,
        rating: data.rating ?? undefined,
        rating_note: data.rating_note ?? undefined,
    };
}, (order) => {
    const therapist = therapistRepo.find((therapist) => {
        return therapist.id === order.therapist_id;
    });

    therapist.client_total = typeof therapist.client_total === 'number' ? therapist.client_total : 0;

    const isPastCustomerExists = orderRepo.items.filter((o) => {
        return o.user_id === order.user_id && o.therapist_id === order.therapist_id;
    }).length === 2;

    if (!isPastCustomerExists) {
        therapist.client_total += 1;
    }

    activityLogRepo.create({
        user_id: order.user_id,
        activity_type: 'Make an Appointment',
        device_info: 'Redmi Note 10 Pro',
        ip_address: '36.80.171.248',
        location: 'Semarang, Indonesia',
        result: '',
        created_at: order.created_at,
        updated_at: order.updated_at,
    });
});

const activityLogRepo = model({
    type: 'object',
    properties: {
        user_id: { type: 'number' },
        activity_type: { type: 'string' },
        location: { type: 'string' },
        ip_address: { type: 'string' },
        device_info: { type: 'string' },
        result: { type: 'string' },
        created_at: { type: 'string' },
        updated_at: { type: 'string' },
    },
}, (data) => {
    return {
        user_id: data.user_id,
        activity_type: data.activity_type,
        location: data.location,
        ip_address: data.ip_address,
        device_info: data.device_info,
        result: data.result,
        created_at: data.created_at,
        updated_at: data.updated_at,
    };
});

const paymentRepo = model({
    type: 'object',
    properties: {
        order_id: { type: 'number' },
        user_id: { type: 'number' },
        payment_method: { type: 'string' },
        payment_status: { type: 'string' },
        amount_paid: { type: 'number' },
        to_account: { type: 'string' },
        sender_account: { type: 'string' },
        payment_expired: { type: 'string' },
        payment_at: { type: 'string' },
        created_at: { type: 'string' },
        updated_at: { type: 'string' },
        service_name: { type: 'string' },
        appointment_duration: { type: 'string' },
        user_first_name: { type: 'string' },
        user_last_name: { type: 'string' },
    },
}, (data) => {
    const order = orderRepo.find((o) => o.id === data.order_id);
    const service = serviceRepo.find((s) => s.id === order.service_id);
    const user = userRepo.find((u) => u.id === data.user_id);

    return {
        order_id: data.order_id,
        user_id: data.user_id,
        payment_method: data.payment_method,
        payment_status: data.payment_status,
        amount_paid: data.amount_paid,
        to_account: data.to_account,
        sender_account: data.sender_account,
        payment_expired: data.payment_expired,
        payment_at: data.payment_at,
        created_at: data.created_at,
        updated_at: data.updated_at,
        service_name: service.name,
        appointment_duration: order.appointment_duration,
        user_first_name: user.first_name,
        user_last_name: user.last_name,
    };
}, (payment) => {
    const order = orderRepo.find((o) => o.id === payment.order_id);

    order.payment_method = payment.payment_method;
    order.payment_status = payment.payment_status;
    order.sender_account = payment.sender_account;

    const therapist = therapistRepo.find((t) => t.id === order.therapist_id);
    const user = userRepo.find((u) => u.id === therapist.user_id);

    if (payment.payment_status === 'SUCCESS') {
        if (typeof user.balance !== 'number') {
            user.balance = 0;
        }
        user.balance += payment.amount_paid;
    }
});

/**
 * @template T
 * @param {T} schema
 * @param {(data: Partial<JTDDataType<T>>) => JTDDataType<T>} [mapper] digunakan untuk normalisasi data dan preparasi sebelum validasi
 * @param {(data: Partial<JTDDataType<T>>) => void} [afterCreate]
 */
function model(schema, mapper, afterCreate) {
    /** @typedef {JTDDataType<typeof schema>} Schema */

    /** @type {Array<Partial<Schema>>} */
    const rawItems = [];
    /** @type {Array<Schema>} */
    const items = [];

    const ajvValidate = ajv.compile(/** @type {any} */ (schema));

    /**
     * @param {Partial<Schema>} data
     * @returns {Schema}
     */
    function validate(data) {
        const mappedData = typeof mapper === 'function'
            ? mapper(data)
            : data;
        if (!ajvValidate(mappedData)) {
            new Error(`Validation failed: ${JSON.stringify(data)}; cause: ${JSON.stringify(ajvValidate.errors)}`);
        }
        return /** @type {Schema} */ (mappedData);
    }

    /**
     * @param {Partial<Schema>} data
     * @returns {Schema}
     */
    function create(data) {
        const validatedData = validate(data);
        rawItems.push(data);
        items.push(validatedData);
        if (typeof afterCreate === 'function') {
            afterCreate(validatedData);
        }
        return validatedData;
    }

    /** @type {Schema} */
    const type = /** @type {any} */ (undefined);

    return {
        schema,
        type,
        rawItems,
        items,
        validate,
        create,
        /**
         * @param {(data: Partial<JTDDataType<T>>) => boolean} filterFn 
         */
        find(filterFn) {
            const item = items.find(filterFn);
            if (!item) {
                throw new Error('Item not found');
            }
            return item;
        },
    };
}

module.exports = {
    serviceRepo,
    userRepo,
    ratingRepo,
    therapistRepo,
    orderRepo,
    activityLogRepo,
    paymentRepo,

    model,
};
